package com.ecommerce.product.mapper;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
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

    public void mapVariants(Product product,
                            List<VariantDTO> variantsDTO,
                            Map<String, ProductColor> colorMap) {

        Map<String, ProductVariant> existingMap = product.getVariants()
                .stream()
                .collect(Collectors.toMap(
                        v -> v.getColor().getColorKey() + "_" + v.getStorage(),
                        v -> v
                ));

        Set<String> newKeys = new HashSet<>();

        for (VariantDTO v : variantsDTO) {

            String colorKey = slugService.slugify(v.getColorKey());
            String key = colorKey + "_" + v.getStorage();
            newKeys.add(key);

            ProductVariant variant = existingMap.get(key);

            if (variant == null) {
                variant = new ProductVariant();
                variant.setProduct(product);

                ProductColor pc = colorMap.get(colorKey);
                if (pc == null) {
                    throw new AppException("COLOR_NOT_FOUND", "Màu không tồn tại: " + v.getColorKey());
                }

                variant.setColor(pc);
                variant.setStorage(v.getStorage());

                product.getVariants().add(variant);
            }

            variant.setPrice(v.getPrice());
            variant.setOriginalPrice(v.getOriginalPrice());
            variant.setStock(v.getStock());
        }

        product.getVariants().removeIf(v -> {
            String key = v.getColor().getColorKey() + "_" + v.getStorage();
            return !newKeys.contains(key);
        });
    }
}