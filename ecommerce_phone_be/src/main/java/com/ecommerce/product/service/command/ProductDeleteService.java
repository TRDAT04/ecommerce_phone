package com.ecommerce.product.service.command;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductDeleteService {

    private final ProductRepository productRepository;

    public ProductDeleteService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found " + id));
        productRepository.delete(product);
    }
}