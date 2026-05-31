package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import org.springframework.http.HttpStatus;
import com.ecommerce.common.service.EmailService;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderCancelService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Transactional
    public void cancelOrderForUser(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getStatus().equals("PENDING")) {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot cancel this order");
        }

        for (com.ecommerce.order.entity.OrderDetail d : order.getOrderDetails()) {
            com.ecommerce.product.entity.ProductVariant v = d.getVariant();
            v.setStock(v.getStock() + d.getQuantity());
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // Gửi email thông báo hủy đơn hàng
        String email = order.getUser() != null ? order.getUser().getEmail() : null;
        if (email != null) {
            emailService.sendCancelled(order, email);
        } else {
            log.warn("Không gửi email hủy đơn #{}: đơn hàng không có tài khoản liên kết", order.getOrderCode());
        }
    }
}