package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.order.dto.response.OrderItemResponse;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderQueryService {

    private final OrderRepository orderRepository;

    public List<TrackOrderMiniDTO> getByPhoneMini(String phone) {
        return orderRepository.findMiniByPhone(phone);
    }

    public OrderResponse getById(Long id) {

        Order order = orderRepository.findFullById(id)
                .orElseThrow(() -> new AppException("Order not found"));

        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setCustomerName(order.getCustomerName());
        res.setPhone(order.getPhone());
        res.setAddress(order.getAddress());
        res.setStatus(order.getStatus());
        res.setTotalPrice(order.getTotalPrice());
        res.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> items = order.getOrderDetails().stream().map(d -> {
            OrderItemResponse i = new OrderItemResponse();

            i.setProductName(d.getVariant().getProduct().getName());
            i.setImage(d.getVariant().getProduct().getImageUrl());
            i.setColor(d.getVariant().getColor().getName());
            i.setStorage(d.getVariant().getStorage());
            i.setPrice(d.getPrice());
            i.setQuantity(d.getQuantity());

            return i;
        }).toList();

        res.setItems(items);

        return res;
    }

    public org.springframework.data.domain.Page<OrderResponse> getAll(String status, String phone, org.springframework.data.domain.Pageable pageable) {

        org.springframework.data.domain.Page<Order> orders;

        if (status != null) {
            orders = orderRepository.findByStatus(status, pageable);
        } else if (phone != null) {
            orders = orderRepository.findByPhoneContaining(phone, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        return orders.map(this::mapToResponse);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();

        res.setId(order.getId());
        res.setCustomerName(order.getCustomerName());
        res.setPhone(order.getPhone());
        res.setAddress(order.getAddress());
        res.setStatus(order.getStatus());
        res.setTotalPrice(order.getTotalPrice());
        res.setCreatedAt(order.getCreatedAt());

        return res;
    }
}