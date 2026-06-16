package com.ecommerce.order.repository;

import com.ecommerce.order.dto.response.MyOrderDTO;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByPhone(String phone);

    boolean existsByOrderCode(String orderCode);

    @Query("""
                SELECT o FROM Order o
                LEFT JOIN FETCH o.orderDetails od
                LEFT JOIN FETCH od.variant v
                LEFT JOIN FETCH v.product p
                LEFT JOIN FETCH v.color c
                WHERE o.id = :id
            """)
    Optional<Order> findFullById(Long id);

    org.springframework.data.domain.Page<Order> findByStatus(String status, Pageable pageable);

    org.springframework.data.domain.Page<Order> findByPhoneContaining(String phone, Pageable pageable);

    @Query("""
                SELECT new com.ecommerce.order.dto.response.MyOrderDTO(
                    o.id,
                    o.orderCode,
                    o.status,
                    o.totalPrice,
                    o.createdAt
                )
                FROM Order o
                WHERE o.user.email = :email
                ORDER BY o.createdAt DESC
            """)
    List<MyOrderDTO> findMyOrders(String email);

    @Query("""
            SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END
            FROM Order o
            JOIN o.orderDetails od
            JOIN od.variant v
            WHERE o.user.id = :userId
            AND o.status = 'DONE'
            AND v.product.id = :productId
            """)
    boolean existsOrderDoneByUserAndProduct(Long userId, Long productId);

    //Dashboard
    @Query("""
                SELECT SUM(o.totalPrice)
                FROM Order o
                WHERE o.status = 'DONE'
            """)
    Double sumTotalRevenue();

    // Revenue theo tháng, lọc theo năm — trả về [month, revenue, orderCount]
    @Query(value = """
                SELECT TO_CHAR(o.created_at, 'YYYY-MM') AS month,
                       SUM(o.total_price)               AS revenue,
                       COUNT(o.id)                      AS order_count
                FROM orders o
                WHERE o.status = 'DONE'
                  AND EXTRACT(YEAR FROM o.created_at) = :year
                GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
                ORDER BY month
            """, nativeQuery = true)
    List<Object[]> revenueByMonth(@Param("year") int year);


    // Tổng doanh thu DONE theo năm (dùng cho summary + tăng trưởng YoY)
    @Query(value = """
                SELECT COALESCE(SUM(o.total_price), 0)
                FROM orders o
                WHERE o.status = 'DONE'
                  AND EXTRACT(YEAR FROM o.created_at) = :year
            """, nativeQuery = true)
    Double sumRevenueByYear(@Param("year") int year);

    // Tổng số đơn DONE theo năm
    @Query(value = """
                SELECT COUNT(o.id)
                FROM orders o
                WHERE o.status = 'DONE'
                  AND EXTRACT(YEAR FROM o.created_at) = :year
            """, nativeQuery = true)
    Long countOrdersByYear(@Param("year") int year);

    // Tổng doanh thu DONE theo năm + tháng cụ thể (dùng cho MoM% ở OverviewCard)
    @Query(value = """
                SELECT COALESCE(SUM(o.total_price), 0)
                FROM orders o
                WHERE o.status = 'DONE'
                  AND EXTRACT(YEAR  FROM o.created_at) = :year
                  AND EXTRACT(MONTH FROM o.created_at) = :month
            """, nativeQuery = true)
    Double sumRevenueByYearMonth(@Param("year") int year, @Param("month") int month);

    @Query("""
                SELECT o 
                FROM Order o 
                ORDER BY o.createdAt DESC
            """)
    List<Order> getRecentOrders(Pageable pageable);

    @Query("""
            SELECT new com.ecommerce.order.dto.response.TrackOrderMiniDTO(
                o.id,
                o.orderCode,
                o.status,
                o.totalPrice
            )
            FROM Order o
            WHERE o.phone = :phone
            ORDER BY o.createdAt DESC
            """)
    List<TrackOrderMiniDTO> findMiniByPhone(String phone);

    @Query("""
            SELECT new com.ecommerce.order.dto.response.TrackOrderMiniDTO(
                o.id,
                o.orderCode,
                o.status,
                o.totalPrice
            )
            FROM Order o
            WHERE o.orderCode = :orderCode AND o.phone = :phone
            """)
    Optional<TrackOrderMiniDTO> findMiniByOrderCodeAndPhone(String orderCode, String phone);

    @Query("""
                SELECT o FROM Order o
                LEFT JOIN FETCH o.orderDetails od
                LEFT JOIN FETCH od.variant v
                LEFT JOIN FETCH v.product p
                LEFT JOIN FETCH v.color c
                WHERE o.orderCode = :orderCode
            """)
    Optional<Order> findFullByOrderCode(String orderCode);
}