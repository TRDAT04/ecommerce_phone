package com.ecommerce.product.service.query;

import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.mapper.ProductBasicMapper;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductDetailService {

    private final ProductRepository productRepository;
    private final ProductDetailBuilder productDetailBuilder;
    private final ProductBasicMapper basicMapper;

    public ProductDetailService(ProductRepository productRepository,
                                ProductDetailBuilder productDetailBuilder,
                                ProductBasicMapper basicMapper) {
        this.productRepository = productRepository;
        this.productDetailBuilder = productDetailBuilder;
        this.basicMapper = basicMapper;
    }

    public List<ProductHomeDTO> getProductsForHome() {
        return productRepository.findAll()
                .stream()
                .map(basicMapper::toHomeDTO)
                .toList();
    }

    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }

    public ProductDetailDTO getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return productDetailBuilder.build(product);
    }
}