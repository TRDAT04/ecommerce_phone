package com.ecommerce.product.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProductDTO {
    private Long id;
    private String name;
    private String brand;
    private MultipartFile image;
    private String description;
    private Double rating;
    private Boolean isFeatured;

    private String variants;
    private String specifications;

    private String colors;
}