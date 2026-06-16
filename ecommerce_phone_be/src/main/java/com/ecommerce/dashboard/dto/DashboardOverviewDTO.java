package com.ecommerce.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardOverviewDTO {
    private long   totalUsers;
    private long   totalOrders;
    private long   totalProducts;
    private double totalRevenue;        // all-time doanh thu (đơn DONE)
    private long   totalReviews;

    // Bổ sung để hiển thị trend trên OverviewCard
    private double currentMonthRevenue; // doanh thu tháng hiện tại
    private double lastMonthRevenue;    // doanh thu tháng trước (để tính MoM%)
}