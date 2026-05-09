package com.ecommerce.product.service.image;

import com.ecommerce.product.entity.ProductImage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductImageService {

    private final ProductImageQueryService queryService;
    private final ProductImageCommandService commandService;


    public ProductImageService(ProductImageQueryService queryService,
                               ProductImageCommandService commandService
    ) {
        this.queryService = queryService;
        this.commandService = commandService;

    }

    // ===== delegate =====

    public List<ProductImage> getImages(Long productId, String color) {
        return queryService.getImages(productId, color);
    }

    public List<ProductImage> uploadImages(Long productId, String color, MultipartFile[] files) {
        return commandService.uploadImages(productId, color, files);
    }

    public void deleteImage(Long imageId) {
        commandService.deleteImage(imageId);
    }

    public void updateSortOrder(Long productId, String color, List<Long> imageIds) {
        commandService.updateSortOrder(productId, color, imageIds);
    }


}