package com.ecommerce.dashboard.controller;

import com.ecommerce.dashboard.dto.DashboardOverviewDTO;
import com.ecommerce.dashboard.dto.RecentOrderDTO;
import com.ecommerce.dashboard.dto.RevenueDTO;
import com.ecommerce.dashboard.dto.TopProductDTO;
import com.ecommerce.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/revenue")
    public List<RevenueDTO> revenue() {
        return dashboardService.getRevenueByMonth();
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