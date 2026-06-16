package com.ecommerce.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueSummaryDTO {
    private double totalRevenue;      // tổng doanh thu cả năm (đơn DONE)
    private long totalOrders;         // tổng số đơn DONE cả năm
    private double avgMonthlyRevenue; // doanh thu trung bình / tháng
    private String bestMonth;         // tháng có doanh thu cao nhất (vd: "2026-05")
    private double bestMonthRevenue;  // doanh thu của tháng cao nhất
    private double growthVsLastYear;  // % tăng trưởng so với năm trước (có thể null/0 nếu chưa có data)
    private int year;                 // năm đang xem
}
