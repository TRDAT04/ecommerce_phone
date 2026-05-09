package com.ecommerce.order.service;

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
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!order.getStatus().equals("PENDING")) {
            throw new RuntimeException("Cannot cancel this order");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}