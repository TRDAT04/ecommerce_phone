package com.ecommerce.order.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private String phone;
    private String address;
    private String note;
    private List<OrderItemRequest> items;
}