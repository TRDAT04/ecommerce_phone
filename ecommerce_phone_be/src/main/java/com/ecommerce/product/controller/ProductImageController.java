package com.ecommerce.product.controller;

import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.service.image.ProductImageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin("*")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    // ===== GET =====
    @GetMapping
    public List<ProductImage> getImages(
            @RequestParam Long productId,
            @RequestParam String color
    ) {
        return productImageService.getImages(productId, color);
    }

    // ===== UPLOAD =====
    @PostMapping
    public List<ProductImage> upload(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestParam MultipartFile[] files
    ) {
        return productImageService.uploadImages(productId, color, files);
    }

    // ===== DELETE =====
    @DeleteMapping("/{imageId}")
    public void delete(@PathVariable Long imageId) {
        productImageService.deleteImage(imageId);
    }

    // ===== SORT =====
    @PutMapping("/sort")
    public void sort(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestBody List<Long> imageIds
    ) {
        productImageService.updateSortOrder(productId, color, imageIds);
    }
}