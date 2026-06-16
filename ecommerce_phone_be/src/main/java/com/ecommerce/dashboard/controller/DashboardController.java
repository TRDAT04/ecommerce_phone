package com.ecommerce.dashboard.controller;

import com.ecommerce.dashboard.dto.DashboardOverviewDTO;
import com.ecommerce.dashboard.dto.RecentOrderDTO;
import com.ecommerce.dashboard.dto.RevenueDTO;
import com.ecommerce.dashboard.dto.RevenueSummaryDTO;
import com.ecommerce.dashboard.dto.TopProductDTO;
import com.ecommerce.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public DashboardOverviewDTO overview() {
        return dashboardService.getOverview();
    }

    // GET /api/admin/dashboard/revenue?year=2026
    @GetMapping("/revenue")
    public List<RevenueDTO> revenue(
            @RequestParam(defaultValue = "0") int year) {
        if (year <= 0) year = LocalDate.now().getYear();
        return dashboardService.getRevenueByMonth(year);
    }

    // GET /api/admin/dashboard/revenue/summary?year=2026
    @GetMapping("/revenue/summary")
    public RevenueSummaryDTO revenueSummary(
            @RequestParam(defaultValue = "0") int year) {
        if (year <= 0) year = LocalDate.now().getYear();
        return dashboardService.getRevenueSummary(year);
    }


    @GetMapping("/recent-orders")
    public List<RecentOrderDTO> recentOrders() {
        return dashboardService.getRecentOrders();
    }

    @GetMapping("/top-products")
    public List<TopProductDTO> topProduct() {
        return dashboardService.getTopProducts();
    }
}