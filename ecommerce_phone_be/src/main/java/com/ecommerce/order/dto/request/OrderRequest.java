package com.ecommerce.order.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Data
public class OrderRequest {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private String note;

    @NotEmpty(message = "Order items cannot be empty")
    @jakarta.validation.Valid
    private List<OrderItemRequest> items;
}