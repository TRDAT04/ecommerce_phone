package com.ecommerce.review.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.review.dto.ReviewRequest;
import com.ecommerce.review.dto.ReviewResponse;
import com.ecommerce.review.entity.Review;
import com.ecommerce.review.repository.ReviewRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final OrderRepository orderRepo;

    // ================= CREATE REVIEW =================
    public Review createReview(String email, ReviewRequest req) {

        // 1. user
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException("User không tồn tại"));

        // 2. product
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new AppException("Sản phẩm không tồn tại"));

        // 3. CHECK ĐÃ
        boolean hasBought = orderRepo.existsOrderDoneByUserAndProduct(
                user.getId(),
                product.getId()
        );

        if (!hasBought) {
            throw new AppException("Bạn chưa mua sản phẩm này");
        }

        // 4. CHECK ĐÃ REVIEW
        boolean alreadyReviewed = reviewRepo.existsByUserIdAndProductId(
                user.getId(),
                product.getId()
        );

        if (alreadyReviewed) {
            throw new AppException("Bạn đã đánh giá sản phẩm này rồi");
        }

        // 5. CREATE
        Review review = new Review();
        review.setRating(req.getRating());
        review.setContent(req.getContent());
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setProduct(product);

        reviewRepo.save(review);

        // 6. update rating
        updateProductRating(product.getId());

        return review;
    }

    // ================= GET REVIEW =================
    public List<ReviewResponse> getByProduct(Long productId) {

        List<Review> reviews = reviewRepo.findByProductIdOrderByCreatedAtDesc(productId);

        return reviews.stream().map(r -> {
            ReviewResponse dto = new ReviewResponse();

            dto.setId(r.getId());
            dto.setRating(r.getRating());
            dto.setContent(r.getContent());
            dto.setImages(r.getImages());

            // user
            dto.setUserName(r.getUser().getName());
            dto.setAvatar(
                    r.getUser().getName() != null
                            ? r.getUser().getName().substring(0, 1).toUpperCase()
                            : "U"
            );

            dto.setCreatedAt(
                    r.getCreatedAt().format(
                            java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                    )
            );

            return dto;
        }).toList();
    }

    // ================= UPDATE AVG =================
    private void updateProductRating(Long productId) {

        Double avg = reviewRepo.getAverageRating(productId);

        Product product = productRepo.findById(productId)
                .orElseThrow();

        product.setRating(avg != null ? avg : 0);

        productRepo.save(product);
    }
}