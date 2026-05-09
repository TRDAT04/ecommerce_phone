package com.ecommerce.product.dto.common;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class VariantDTO {
    private Long id;
    private String storage;
    private String colorKey;
    private String colorName;
    private Double price;
    private Double originalPrice;
    private Integer stock;

    private String imageUrl; // ảnh đại diện
    private List<String> images = new ArrayList<>();
}