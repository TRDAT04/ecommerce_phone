package com.ecommerce.product.dto.response;

import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.dto.common.VariantDTO;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductDetailDTO {
    private Long id;
    private String name;
    private String brand;
    private String imageUrl;
    private Double rating;
    private String description;
    private List<String> storages;
    private List<ColorDTO> colors;

    private List<VariantDTO> variants;
    private List<SpecDTO> specifications;

    private Map<String, VariantDTO> variantMap;
}