package com.ecommerce.product.mapper;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.entity.ProductVariant;
import com.ecommerce.product.service.helper.SlugService;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ProductVariantMapper {

    private final SlugService slugService;

    public ProductVariantMapper(SlugService slugService) {
        this.slugService = slugService;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public VariantDTO toDTO(Product product, ProductVariant v) {
        List<String> images = getImages(product, v.getColor().getColorKey());

        VariantDTO d = new VariantDTO();
        d.setId(v.getId());
        d.setStorage(v.getStorage());
        d.setColorName(v.getColor().getName());
        d.setColorKey(v.getColor().getColorKey());
        d.setPrice(v.getPrice());
        d.setOriginalPrice(v.getOriginalPrice());
        d.setStock(v.getStock());
        d.setImages(images);
        d.setImageUrl(images.isEmpty() ? null : images.get(0));
        return d;
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public void mapVariants(Product product, List<VariantDTO> variantsDTO, Map<String, ProductColor> colorMap) {
        Map<String, ProductVariant> existingMap = product.getVariants().stream()
                .collect(Collectors.toMap(v -> variantKey(v.getColor().getColorKey(), v.getStorage()), v -> v));

        Set<String> newKeys = new HashSet<>();

        for (VariantDTO dto : variantsDTO) {
            String colorKey = slugService.slugify(dto.getColorKey());
            String key = variantKey(colorKey, dto.getStorage());
            newKeys.add(key);

            ProductVariant variant = existingMap.computeIfAbsent(key,
                    k -> createVariant(product, colorKey, dto.getStorage(), colorMap));

            variant.setPrice(dto.getPrice());
            variant.setOriginalPrice(dto.getOriginalPrice());
            variant.setStock(dto.getStock());
        }

        product.getVariants().removeIf(v -> !newKeys.contains(variantKey(v.getColor().getColorKey(), v.getStorage())));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private ProductVariant createVariant(Product product, String colorKey, String storage, Map<String, ProductColor> colorMap) {
        ProductColor pc = Optional.ofNullable(colorMap.get(colorKey))
                .orElseThrow(() -> new AppException("COLOR_NOT_FOUND", "Màu không tồn tại: " + colorKey));

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setColor(pc);
        variant.setStorage(storage);
        product.getVariants().add(variant);
        return variant;
    }

    private String variantKey(String colorKey, String storage) {
        return colorKey + "_" + storage;
    }

    private List<String> getImages(Product product, String colorKey) {
        return product.getImages().stream()
                .filter(img -> img.getColor().getColorKey().equals(colorKey))
                .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
                .map(ProductImage::getImageUrl)
                .toList();
    }
}