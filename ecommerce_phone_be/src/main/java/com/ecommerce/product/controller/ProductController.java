package com.ecommerce.product.controller;

import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.dto.request.UpdateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductHomeDTO> getHome() {
        return productService.getProductsForHome();
    }

    @GetMapping("/brands")
    public List<String> getBrands() {
        return productService.getBrands();
    }

    @GetMapping("/{id}")
    public ProductDetailDTO getDetail(@PathVariable Long id) {
        return productService.getProductDetail(id);
    }

    @PostMapping(value = "", consumes = "multipart/form-data")
    public ProductDetailDTO createProduct(@ModelAttribute CreateProductDTO dto) throws IOException {

        return productService.createProduct(dto);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ProductDetailDTO updateProduct(
            @PathVariable Long id,
            @ModelAttribute UpdateProductDTO dto
    ) throws IOException {
        return productService.updateProduct(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/search")
    public Page<ProductHomeDTO> search(ProductFilterRequest filter) {
        return productService.search(filter);
    }
}