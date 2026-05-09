package com.ecommerce.order.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String customerName;
    private String phone;
    private String address;
    private String status;
    private Double totalPrice;
    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}