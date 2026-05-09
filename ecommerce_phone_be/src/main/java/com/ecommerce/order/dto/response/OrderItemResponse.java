package com.ecommerce.order.dto.response;

import lombok.Data;

@Data
public class OrderItemResponse {
    private String productName;
    private String image;
    private String color;
    private String storage;
    private Double price;
    private Integer quantity;
}