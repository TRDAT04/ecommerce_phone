package com.ecommerce.product.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
public class CreateProductDTO {

    private String name;
    private String brand;
    private String description;

    private MultipartFile image;

    private String variants;
    private String specifications;


    private Map<String, List<MultipartFile>> colorImages;


    private String colors;
}