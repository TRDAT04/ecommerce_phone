package com.ecommerce.product.service.image;

import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ProductImageQueryService {

    private final ProductRepository productRepository;

    public ProductImageQueryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductImage> getImages(Long productId, String color) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String colorKey = color.trim().toLowerCase();

        return product.getImages().stream()
                .filter(img ->
                        img.getColor() != null &&
                                img.getColor().getColorKey().equalsIgnoreCase(colorKey)
                )
                .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
                .toList();
    }
}