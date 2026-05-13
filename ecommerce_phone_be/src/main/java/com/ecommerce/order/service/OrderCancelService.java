package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderCancelService {

    private final OrderRepository orderRepository;

    @Transactional
    public void cancelOrderForUser(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Not found"));

        if (!order.getStatus().equals("PENDING")) {
            throw new AppException("Cannot cancel this order");
        }

        for (com.ecommerce.order.entity.OrderDetail d : order.getOrderDetails()) {
            com.ecommerce.product.entity.ProductVariant v = d.getVariant();
            v.setStock(v.getStock() + d.getQuantity());
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}