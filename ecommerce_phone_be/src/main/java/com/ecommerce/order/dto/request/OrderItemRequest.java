package com.ecommerce.order.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long variantId;
    private Integer quantity;
}