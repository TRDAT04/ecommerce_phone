package com.ecommerce.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardOverviewDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
    private long totalReviews;
}