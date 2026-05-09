package com.ecommerce.review.repository;

import com.ecommerce.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRating(Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
}