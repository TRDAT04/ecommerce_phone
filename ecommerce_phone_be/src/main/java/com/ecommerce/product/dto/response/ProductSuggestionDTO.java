package com.ecommerce.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSuggestionDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private Double minPrice;
}