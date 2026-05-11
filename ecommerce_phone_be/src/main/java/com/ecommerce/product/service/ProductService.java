package com.ecommerce.product.service;

import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.dto.request.UpdateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.dto.response.ProductSuggestionDTO;
import com.ecommerce.product.service.command.ProductCreateService;
import com.ecommerce.product.service.command.ProductUpdateService;
import com.ecommerce.product.service.command.ProductDeleteService;
import com.ecommerce.product.service.query.ProductDetailService;
import com.ecommerce.product.service.query.ProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductDetailService detailService;
    private final ProductCreateService createService;
    private final ProductUpdateService updateService;
    private final ProductDeleteService deleteService;
    private final ProductSearchService searchService;


    public Page<ProductHomeDTO> getProducts(ProductFilterRequest filter) {
        return searchService.search(filter);
    }

    public List<ProductSuggestionDTO> suggestProducts(String keyword) {
        return searchService.suggest(keyword);
    }

    public List<String> getBrands() {
        return detailService.getBrands();
    }

    public ProductDetailDTO getProductDetail(Long id) {
        return detailService.getProductDetail(id);
    }

    public ProductDetailDTO createProduct(CreateProductDTO dto) {
        return createService.createProduct(dto);
    }

    public ProductDetailDTO updateProduct(Long id, UpdateProductDTO dto) {
        return updateService.updateProduct(id, dto);
    }

    public void deleteProduct(Long id) {
        deleteService.deleteProduct(id);
    }


}