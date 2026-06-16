package com.ecommerce.product.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductHomeDTO {

    private Long id;

    private String name;

    private String brand;

    private String imageUrl;

    private Double rating;

    private Double minPrice;
    private Double minOriginalPrice;

    private List<String> storages;
    private Integer ram;
    private Double screen;
    private Integer battery;

    private Integer totalStock; // Tổng tồn kho tất cả variants → 0 = hết hàng
}