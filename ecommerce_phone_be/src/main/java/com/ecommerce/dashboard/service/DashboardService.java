package com.ecommerce.dashboard.service;

import com.ecommerce.dashboard.dto.DashboardOverviewDTO;
import com.ecommerce.dashboard.dto.RecentOrderDTO;
import com.ecommerce.dashboard.dto.RevenueDTO;
import com.ecommerce.dashboard.dto.RevenueSummaryDTO;
import com.ecommerce.dashboard.dto.TopProductDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderDetailRepository;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.review.repository.ReviewRepository;
import com.ecommerce.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // =============================
    // 1. OVERVIEW
    // =============================
    public DashboardOverviewDTO getOverview() {
        log.info("Fetching dashboard overview...");

        long totalUsers    = userRepository.count();
        long totalOrders   = orderRepository.count();
        long totalProducts = productRepository.count();
        long totalReviews  = reviewRepository.count();

        Double revenue = orderRepository.sumTotalRevenue();
        if (revenue == null) revenue = 0.0;

        // Doanh thu tháng hiện tại và tháng trước (cho MoM%)
        java.time.LocalDate now = java.time.LocalDate.now();
        int    thisYear  = now.getYear();
        int    thisMonth = now.getMonthValue();

        java.time.LocalDate lastMonthDate = now.minusMonths(1);
        int    lastYear  = lastMonthDate.getYear();
        int    lastMonth = lastMonthDate.getMonthValue();

        Double rawCurrent = orderRepository.sumRevenueByYearMonth(thisYear, thisMonth);
        Double rawLast    = orderRepository.sumRevenueByYearMonth(lastYear, lastMonth);
        double currentMonthRevenue = rawCurrent != null ? rawCurrent : 0.0;
        double lastMonthRevenue    = rawLast    != null ? rawLast    : 0.0;

        return new DashboardOverviewDTO(
                totalUsers, totalOrders, totalProducts, revenue, totalReviews,
                currentMonthRevenue, lastMonthRevenue
        );
    }


    // =============================
    // 2. REVENUE BY MONTH (lọc theo năm)
    // =============================
    public List<RevenueDTO> getRevenueByMonth(int year) {
        List<Object[]> rows = orderRepository.revenueByMonth(year);

        return rows.stream()
                .map(row -> {
                    double rev    = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                    long   cnt    = row[2] != null ? ((Number) row[2]).longValue()   : 0L;
                    double avgVal = cnt > 0 ? rev / cnt : 0.0;
                    return new RevenueDTO((String) row[0], rev, cnt, avgVal);
                })
                .toList();
    }

    // =============================
    // 3. REVENUE SUMMARY — KPI tổng hợp theo năm
    // =============================
    public RevenueSummaryDTO getRevenueSummary(int year) {
        Double rawRevenue  = orderRepository.sumRevenueByYear(year);
        double totalRevenue = rawRevenue != null ? rawRevenue : 0.0;

        Long rawOrders   = orderRepository.countOrdersByYear(year);
        long totalOrders = rawOrders != null ? rawOrders : 0L;

        // Tháng cao nhất
        List<RevenueDTO> monthly = getRevenueByMonth(year);
        String bestMonth         = null;
        double bestMonthRevenue  = 0.0;
        for (RevenueDTO dto : monthly) {
            if (dto.getRevenue() > bestMonthRevenue) {
                bestMonthRevenue = dto.getRevenue();
                bestMonth        = dto.getMonth();
            }
        }

        // Trung bình tháng (chỉ tính tháng có đơn)
        long   activeMonths = monthly.stream().filter(d -> d.getRevenue() > 0).count();
        double avgMonthly   = activeMonths > 0 ? totalRevenue / activeMonths : 0.0;

        // Tăng trưởng YoY
        Double rawLast          = orderRepository.sumRevenueByYear(year - 1);
        double lastYearRevenue  = rawLast != null ? rawLast : 0.0;
        double growthVsLastYear = lastYearRevenue > 0
                ? ((totalRevenue - lastYearRevenue) / lastYearRevenue) * 100.0
                : 0.0;

        return new RevenueSummaryDTO(
                totalRevenue, totalOrders, avgMonthly,
                bestMonth, bestMonthRevenue, growthVsLastYear, year
        );
    }


    // =============================
    // 5. RECENT ORDERS
    // =============================
    public List<RecentOrderDTO> getRecentOrders() {
        List<Order> orders = orderRepository.getRecentOrders(PageRequest.of(0, 20));

        return orders.stream()
                .map(o -> new RecentOrderDTO(
                        o.getId(),
                        o.getUser() != null ? o.getUser().getName() : o.getCustomerName(),
                        o.getTotalPrice(),
                        o.getStatus(),
                        o.getCreatedAt().format(DATE_FORMAT)
                ))
                .toList();
    }

    // =============================
    // 6. TOP PRODUCTS
    // =============================
    public List<TopProductDTO> getTopProducts() {
        return orderDetailRepository.findTopSellingProducts(PageRequest.of(0, 5));
    }
}