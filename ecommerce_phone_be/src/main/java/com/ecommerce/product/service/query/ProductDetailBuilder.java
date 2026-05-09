package com.ecommerce.product.service.query;

import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.*;
import com.ecommerce.product.mapper.ProductVariantViewMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ProductDetailBuilder {

    private final ProductVariantViewMapper variantViewMapper;

    public ProductDetailBuilder(ProductVariantViewMapper variantViewMapper) {
        this.variantViewMapper = variantViewMapper;
    }

    public ProductDetailDTO build(Product product) {

        ProductDetailDTO dto = new ProductDetailDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());

        // ================= VARIANTS + VARIANT MAP =================
        List<VariantDTO> variants = new ArrayList<>();
        Map<String, VariantDTO> variantMap = new HashMap<>();

        for (ProductVariant v : product.getVariants()) {
            VariantDTO d = variantViewMapper.toDTO(product, v);
            variants.add(d);
            String key = v.getStorage() + "|" + v.getColor().getColorKey();
            variantMap.put(key, d);
        }

        dto.setVariants(variants);
        dto.setVariantMap(variantMap);

        // ================= SPECS =================
        dto.setSpecifications(
                product.getSpecifications().stream().map(s -> {
                    SpecDTO d = new SpecDTO();
                    d.setId(s.getId());
                    d.setSpecKey(s.getSpecKey());
                    d.setSpecName(s.getSpecName());
                    d.setSpecValue(s.getSpecValue());
                    return d;
                }).toList()
        );

        // ================= STORAGE =================
        dto.setStorages(
                product.getVariants().stream()
                        .map(ProductVariant::getStorage)
                        .distinct()
                        .toList()
        );

        // ================= COLORS =================
        dto.setColors(
                product.getColors().stream().map(c -> {
                    ColorDTO d = new ColorDTO();
                    d.setName(c.getName());
                    d.setKey(c.getColorKey());
                    return d;
                }).toList()
        );

        return dto;
    }
}