package com.ecommerce.product.controller;

import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.service.image.ProductImageCommandService;
import com.ecommerce.product.service.image.ProductImageQueryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin("*")
public class ProductImageController {

    private final ProductImageQueryService queryService;
    private final ProductImageCommandService commandService;

    public ProductImageController(ProductImageQueryService queryService,
                                  ProductImageCommandService commandService) {
        this.queryService = queryService;
        this.commandService = commandService;
    }

    @GetMapping
    public List<ProductImage> getImages(
            @RequestParam Long productId,
            @RequestParam String color
    ) {
        return queryService.getImages(productId, color);
    }

    @PostMapping
    public List<ProductImage> upload(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestParam MultipartFile[] files
    ) {
        return commandService.uploadImages(productId, color, files);
    }

    @DeleteMapping("/{imageId}")
    public void delete(@PathVariable Long imageId) {
        commandService.deleteImage(imageId);
    }

    @PutMapping("/sort")
    public void sort(
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestBody List<Long> imageIds
    ) {
        commandService.updateSortOrder(productId, color, imageIds);
    }
}