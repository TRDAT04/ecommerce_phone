package com.ecommerce.order.repository;

import com.ecommerce.dashboard.dto.TopProductDTO;
import com.ecommerce.order.entity.OrderDetail;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @Query("""
                SELECT new com.ecommerce.dashboard.dto.TopProductDTO(
                    p.id,
                    p.name,
                    SUM(od.quantity),
                    SUM(od.quantity * od.price)
                )
                FROM OrderDetail od
                JOIN od.order o
                JOIN od.variant v
                JOIN v.product p
                WHERE o.status = 'DONE'
                GROUP BY p.id, p.name
                ORDER BY SUM(od.quantity) DESC
            """)
    List<TopProductDTO> findTopSellingProducts(Pageable pageable);

    boolean existsByProductId(Long productId);
}