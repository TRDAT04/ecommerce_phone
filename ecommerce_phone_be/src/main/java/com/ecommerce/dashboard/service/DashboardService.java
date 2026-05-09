package com.ecommerce.dashboard.service;

import com.ecommerce.dashboard.dto.DashboardOverviewDTO;
import com.ecommerce.dashboard.dto.RevenueDTO;
import com.ecommerce.dashboard.dto.RecentOrderDTO;
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

        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        long totalReviews = reviewRepository.count();
        Double revenue = orderRepository.sumTotalRevenue();
        if (revenue == null) revenue = 0.0;

        return new DashboardOverviewDTO(
                totalUsers,
                totalOrders,
                totalProducts,
                revenue,
                totalReviews
        );
    }

    // =============================
    // 2. REVENUE BY MONTH
    // =============================
    public List<RevenueDTO> getRevenueByMonth() {
        List<Object[]> rows = orderRepository.revenueByMonth();

        return rows.stream()
                .map(row -> new RevenueDTO(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).doubleValue() : 0.0
                ))
                .toList();
    }

    // =============================
    // 3. RECENT ORDERS
    // =============================
    public List<RecentOrderDTO> getRecentOrders() {
        List<Order> orders = orderRepository.getRecentOrders(PageRequest.of(0, 10));

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

    // 4. TOP PRODUCTS
// =============================
    public List<TopProductDTO> getTopProducts() {
        return orderDetailRepository.findTopSellingProducts(PageRequest.of(0, 5));
    }
}