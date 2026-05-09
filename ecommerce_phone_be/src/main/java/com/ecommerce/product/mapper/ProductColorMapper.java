package com.ecommerce.product.mapper;

import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.service.helper.SlugService;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ProductColorMapper {

    private final SlugService slugService;

    public ProductColorMapper(SlugService slugService) {
        this.slugService = slugService;
    }

    public Map<String, ProductColor> mapColors(Product product, List<ColorDTO> colorsDTO) {

        Map<String, ProductColor> colorMap = new HashMap<>();

        for (ColorDTO c : colorsDTO) {

            String key = slugService.slugify(c.getKey());

            ProductColor pc = new ProductColor();
            pc.setName(c.getName().trim());
            pc.setColorKey(key);
            pc.setProduct(product);

            product.getColors().add(pc);
            colorMap.put(key, pc);
        }

        return colorMap;
    }

    public Map<String, ProductColor> syncColors(Product product, List<ColorDTO> colorsDTO) {

        Map<String, ProductColor> currentMap = product.getColors()
                .stream()
                .collect(Collectors.toMap(
                        ProductColor::getColorKey,
                        c -> c
                ));

        Set<String> newKeys = new HashSet<>();

        for (ColorDTO c : colorsDTO) {

            if (c.getKey() == null || c.getKey().isBlank()) continue;

            String key = slugService.slugify(c.getKey());
            newKeys.add(key);

            ProductColor existing = currentMap.get(key);

            if (existing != null) {
                existing.setName(c.getName().trim());
            } else {
                ProductColor pc = new ProductColor();
                pc.setName(c.getName().trim());
                pc.setColorKey(key);
                pc.setProduct(product);

                product.getColors().add(pc);
            }
        }

        product.getColors().removeIf(color -> {

            if (newKeys.contains(color.getColorKey())) return false;

            boolean isUsed = product.getVariants().stream()
                    .anyMatch(v -> v.getColor().getColorKey().equals(color.getColorKey()));

            return !isUsed;
        });

        return product.getColors()
                .stream()
                .collect(Collectors.toMap(
                        ProductColor::getColorKey,
                        c -> c
                ));
    }
}