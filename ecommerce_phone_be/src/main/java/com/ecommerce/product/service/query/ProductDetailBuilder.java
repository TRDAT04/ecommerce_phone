package com.ecommerce.product.service.query;

import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.*;
import com.ecommerce.product.mapper.ProductVariantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductDetailBuilder {

    private final ProductVariantMapper variantViewMapper;

    public ProductDetailDTO build(Product product) {

        ProductDetailDTO dto = new ProductDetailDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        dto.setVariants(buildVariants(product));
        dto.setVariantMap(buildVariantMap(product));
        dto.setSpecifications(buildSpecs(product));
        dto.setStorages(buildStorages(product));
        dto.setColors(buildColors(product));

        return dto;
    }

    // ================= PRIVATE BUILDERS =================

    private List<VariantDTO> buildVariants(Product product) {
        return product.getVariants().stream()
                .map(v -> variantViewMapper.toDTO(product, v))
                .toList();
    }

    private Map<String, VariantDTO> buildVariantMap(Product product) {
        return product.getVariants().stream()
                .collect(Collectors.toMap(
                        v -> v.getStorage() + "|" + v.getColor().getColorKey(),
                        v -> variantViewMapper.toDTO(product, v)
                ));
    }

    private List<SpecDTO> buildSpecs(Product product) {
        return product.getSpecifications().stream()
                .map(this::toSpecDTO)
                .toList();
    }

    private List<String> buildStorages(Product product) {
        return product.getVariants().stream()
                .map(ProductVariant::getStorage)
                .distinct()
                .toList();
    }

    private List<ColorDTO> buildColors(Product product) {
        return product.getColors().stream()
                .map(this::toColorDTO)
                .toList();
    }

    private SpecDTO toSpecDTO(ProductSpecification s) {
        SpecDTO dto = new SpecDTO();
        dto.setId(s.getId());
        dto.setSpecKey(s.getSpecKey());
        dto.setSpecName(s.getSpecName());
        dto.setSpecValue(s.getSpecValue());
        return dto;
    }

    private ColorDTO toColorDTO(ProductColor c) {
        ColorDTO dto = new ColorDTO();
        dto.setName(c.getName());
        dto.setKey(c.getColorKey());
        return dto;
    }
}