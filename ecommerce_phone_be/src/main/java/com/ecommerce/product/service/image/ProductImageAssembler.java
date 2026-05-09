package com.ecommerce.product.service.image;

import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.storage.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class ProductImageAssembler {

    private final ImageStorageService imageStorageService;
    private final SlugService slugService;

    public ProductImageAssembler(ImageStorageService imageStorageService,
                                 SlugService slugService) {
        this.imageStorageService = imageStorageService;
        this.slugService = slugService;
    }

    // ==================== CREATE AVATAR ====================
    public void handleAvatar(Product product,
                             MultipartFile image,
                             String brand,
                             String name) {

        if (image == null || image.isEmpty()) return;

        String brandSlug = slugService.slugify(brand);
        String productSlug = slugService.slugify(name);

        String imageUrl = imageStorageService.saveAvatar(
                image,
                brandSlug,
                productSlug
        );

        product.setImageUrl(imageUrl);
    }

    // ==================== CREATE COLOR IMAGES ====================
    public void handleColorImages(CreateProductDTO dto,
                                  Product product,
                                  Map<String, ProductColor> colorMap,
                                  String brandSlug,
                                  String productSlug) {

        Map<String, List<MultipartFile>> colorImages = dto.getColorImages();
        if (colorImages == null || colorImages.isEmpty()) return;

        colorImages.forEach((colorKey, files) -> {

            String key = slugService.slugify(colorKey);
            ProductColor color = colorMap.get(key);

            if (color == null || files == null || files.isEmpty()) return;

            for (int i = 0; i < files.size(); i++) {

                String imageUrl = imageStorageService.saveVariantImage(
                        files.get(i),
                        brandSlug,
                        productSlug,
                        color.getColorKey(),
                        i + 1
                );

                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setColor(color);
                img.setImageUrl(imageUrl);
                img.setSortOrder(i);

                product.getImages().add(img);
            }
        });
    }

    // ==================== UPDATE AVATAR ====================
    public void updateImage(Product product,
                            MultipartFile image,
                            String brand,
                            String name) {

        if (image == null || image.isEmpty()) return;

        // Xóa ảnh cũ trên Cloudinary (nếu có)
        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            imageStorageService.deleteFileIfExists(product.getImageUrl());
        }

        String brandSlug = slugService.slugify(brand);
        String productSlug = slugService.slugify(name);

        // Upload ảnh mới
        String imageUrl = imageStorageService.saveAvatar(image, brandSlug, productSlug);

        product.setImageUrl(imageUrl);
    }
}