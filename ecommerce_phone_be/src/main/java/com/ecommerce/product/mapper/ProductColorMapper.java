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
            ProductColor pc = buildColor(c.getName(), key, product);
            product.getColors().add(pc);
            colorMap.put(key, pc);
        }

        return colorMap;
    }

    public Map<String, ProductColor> syncColors(Product product, List<ColorDTO> colorsDTO) {
        Map<String, ProductColor> currentMap = toColorMap(product);

        Set<String> newKeys = colorsDTO.stream()
                .filter(c -> c.getKey() != null && !c.getKey().isBlank())
                .map(c -> {
                    String key = slugService.slugify(c.getKey());
                    ProductColor existing = currentMap.get(key);
                    if (existing != null) {
                        existing.setName(c.getName().trim());
                    } else {
                        product.getColors().add(buildColor(c.getName(), key, product));
                    }
                    return key;
                })
                .collect(Collectors.toSet());

        Set<String> usedKeys = product.getVariants().stream()
                .map(v -> v.getColor().getColorKey())
                .collect(Collectors.toSet());

        product.getColors().removeIf(c -> !newKeys.contains(c.getColorKey()) && !usedKeys.contains(c.getColorKey()));

        return toColorMap(product);
    }

    private ProductColor buildColor(String name, String key, Product product) {
        ProductColor pc = new ProductColor();
        pc.setName(name.trim());
        pc.setColorKey(key);
        pc.setProduct(product);
        return pc;
    }

    private Map<String, ProductColor> toColorMap(Product product) {
        return product.getColors().stream()
                .collect(Collectors.toMap(ProductColor::getColorKey, c -> c));
    }
}