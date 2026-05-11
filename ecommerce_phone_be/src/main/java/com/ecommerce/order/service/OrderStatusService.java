package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderDetail;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.product.entity.ProductVariant;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderRepository orderRepository;

    @Transactional
    public void updateStatus(Long id, String newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found"));

        String current = order.getStatus();

        if (current.equals("PENDING") && newStatus.equals("CONFIRMED")) {
            order.setStatus("CONFIRMED");

        } else if (current.equals("CONFIRMED") && newStatus.equals("SHIPPING")) {
            order.setStatus("SHIPPING");

        } else if (current.equals("SHIPPING") && newStatus.equals("DONE")) {
            for (OrderDetail d : order.getOrderDetails()) {
                ProductVariant v = d.getVariant();

                if (v.getProduct() != null) {
                    var product = v.getProduct();

                    product.setSold(product.getSold() + d.getQuantity());
                }
            }
            order.setStatus("DONE");

        } else if ((current.equals("PENDING") || current.equals("CONFIRMED"))
                && newStatus.equals("CANCELLED")) {

            for (OrderDetail d : order.getOrderDetails()) {
                ProductVariant v = d.getVariant();
                v.setStock(v.getStock() + d.getQuantity());
            }

            order.setStatus("CANCELLED");

        } else {
            throw new AppException("Invalid status flow");
        }

        orderRepository.save(order);
    }
}