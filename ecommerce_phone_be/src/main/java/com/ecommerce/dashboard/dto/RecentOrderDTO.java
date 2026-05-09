package com.ecommerce.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecentOrderDTO {
    private Long id;
    private String customerName;
    private double totalPrice;
    private String status;
    private String createdAt;
}