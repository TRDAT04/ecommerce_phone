package com.ecommerce.product.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
public class CreateProductDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand;

    private String description;

    @NotNull(message = "Product image is required")
    private MultipartFile image;

    private String variants;
    private String specifications;


    private Map<String, List<MultipartFile>> colorImages;


    private String colors;
}