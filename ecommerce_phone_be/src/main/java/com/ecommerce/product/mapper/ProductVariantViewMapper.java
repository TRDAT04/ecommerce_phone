package com.ecommerce.product.mapper;

import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class ProductVariantViewMapper {

    public VariantDTO toDTO(Product product, ProductVariant v) {

        VariantDTO d = new VariantDTO();

        d.setId(v.getId());
        d.setStorage(v.getStorage());
        d.setColorName(v.getColor().getName());
        d.setColorKey(v.getColor().getColorKey());
        d.setPrice(v.getPrice());
        d.setOriginalPrice(v.getOriginalPrice());
        d.setStock(v.getStock());

        List<String> images = getImages(product, v.getColor().getColorKey());

        d.setImages(images);
        d.setImageUrl(images.isEmpty() ? null : images.get(0));

        return d;
    }

    private List<String> getImages(Product product, String colorKey) {
        return product.getImages().stream()
                .filter(img -> img.getColor().getColorKey().equals(colorKey))
                .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
                .map(ProductImage::getImageUrl)
                .toList();
    }
}