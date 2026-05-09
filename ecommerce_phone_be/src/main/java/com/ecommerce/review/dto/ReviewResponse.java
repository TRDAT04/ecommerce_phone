package com.ecommerce.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private int rating;
    private String content;
    private String images;
    private String userName;
    private String avatar;
    private String createdAt;
}