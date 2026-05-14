package com.ecommerce.review.dto;

import lombok.Data;

@Data
public class AdminReviewResponse {
    private Long id;
    private int rating;
    private String content;
    private String createdAt;

    // Product info
    private Long productId;
    private String productName;
    private String productImage;

    // User info
    private String userName;
    private String userEmail;
    private String userAvatar;
}
