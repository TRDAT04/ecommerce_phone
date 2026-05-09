package com.ecommerce.product.mapper;

import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class ProductBasicMapper {

    public void mapBasic(Product product, String name, String brand) {
        product.setName(name);
        product.setBrand(brand);
    }

    public ProductHomeDTO toHomeDTO(Product product) {

        ProductHomeDTO dto = new ProductHomeDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setRating(product.getRating());
        dto.setMinPrice(product.getMinPrice());
        dto.setMinOriginalPrice(product.getMinOriginalPrice());
        dto.setScreen(product.getScreenSize());
        dto.setRam(product.getRam());
        dto.setBattery(product.getBattery());

        dto.setStorages(extractStorages(product));

        return dto;
    }

    private List<String> extractStorages(Product product) {
        return product.getVariants()
                .stream()
                .map(ProductVariant::getStorage)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .sorted(Comparator.comparingInt(s -> Integer.parseInt(s.replaceAll("\\D", ""))))
                .toList();
    }
}