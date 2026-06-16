package com.ecommerce.review.repository;

import com.ecommerce.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRating(Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    @Query("SELECT r FROM Review r WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(r.product.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Review> searchAdminReviews(@Param("keyword") String keyword, Pageable pageable);
}