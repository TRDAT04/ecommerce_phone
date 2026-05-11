package com.ecommerce.product.service.query;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.mapper.ProductBasicMapper;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductDetailService {

    private final ProductRepository productRepository;
    private final ProductDetailBuilder productDetailBuilder;


    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }

    public ProductDetailDTO getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found"));
        return productDetailBuilder.build(product);
    }
}