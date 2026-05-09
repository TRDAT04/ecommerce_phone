package com.ecommerce.review.dto;

public class ReviewDTO {
    private String userName;
    private String productName;
    private int rating;
    private String comment;

    public ReviewDTO(String userName, String productName, int rating, String comment) {
        this.userName = userName;
        this.productName = productName;
        this.rating = rating;
        this.comment = comment;
    }
}