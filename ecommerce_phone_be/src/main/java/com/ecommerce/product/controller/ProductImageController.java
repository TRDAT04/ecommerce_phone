package com.ecommerce.product.controller;

import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.service.ProductImageService;
import com.ecommerce.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin("*")
public class ProductImageController {

    private final ProductImageService imageService;

    public ProductImageController(ProductImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping
    public List<ProductImage> getImages(
            @RequestParam Long productId,
            @RequestParam String color
    ) {
        return imageService.getImages(productId, color);
    }

    @PostMapping
    public List<ProductImage> upload(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestParam MultipartFile[] files
    ) {
        return imageService.uploadImages(productId, color, files);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Đã xóa ảnh thành công")
                .build());
    }

    @PutMapping("/sort")
    public ResponseEntity<ApiResponse<Void>> sort(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestBody List<Long> imageIds
    ) {
        imageService.updateSortOrder(productId, color, imageIds);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Cập nhật thứ tự ảnh thành công")
                .build());
    }
}