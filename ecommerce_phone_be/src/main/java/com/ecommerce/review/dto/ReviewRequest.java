package com.ecommerce.review.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private Long orderId;
    private int rating;
    private String content;
    private String images;
}