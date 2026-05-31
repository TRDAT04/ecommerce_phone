package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import org.springframework.http.HttpStatus;
import com.ecommerce.common.service.EmailService;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderDetail;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.product.entity.ProductVariant;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Transactional
    public void updateStatus(Long id, String newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));

        String current = order.getStatus();

        if (current.equals("PENDING") && newStatus.equals("CONFIRMED")) {
            order.setStatus("CONFIRMED");
            orderRepository.save(order);

            // Gửi email thông báo xác nhận đơn hàng
            String email = order.getUser() != null ? order.getUser().getEmail() : null;
            if (email != null) {
                emailService.sendAdminConfirmed(order, email);
            } else {
                log.warn("Không gửi email xác nhận đơn #{}: đơn hàng không có tài khoản liên kết", order.getOrderCode());
            }

        } else if (current.equals("CONFIRMED") && newStatus.equals("SHIPPING")) {
            order.setStatus("SHIPPING");
            orderRepository.save(order);

        } else if (current.equals("SHIPPING") && newStatus.equals("DONE")) {
            for (OrderDetail d : order.getOrderDetails()) {
                ProductVariant v = d.getVariant();
                if (v.getProduct() != null) {
                    var product = v.getProduct();
                    product.setSold(product.getSold() + d.getQuantity());
                }
            }
            order.setStatus("DONE");
            orderRepository.save(order);

        } else if ((current.equals("PENDING") || current.equals("CONFIRMED"))
                && newStatus.equals("CANCELLED")) {

            for (OrderDetail d : order.getOrderDetails()) {
                ProductVariant v = d.getVariant();
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

        } else {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid status flow");
        }
    }
}