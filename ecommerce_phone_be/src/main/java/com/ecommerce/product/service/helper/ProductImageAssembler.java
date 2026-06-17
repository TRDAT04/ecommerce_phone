package com.ecommerce.product.service.helper;

import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.entity.ProductImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ProductImageAssembler {

    private final ImageStorageService imageStorageService;
    private final SlugService slugService;

    // ==================== CREATE AVATAR ====================
    public void handleAvatar(Product product, MultipartFile image, String brand, String name) {
        if (isEmpty(image)) return;
        product.setImageUrl(saveAvatar(image, brand, name));
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
            ProductColor color = colorMap.get(slugService.slugify(colorKey));
            if (color == null || files == null || files.isEmpty()) return;
            attachColorImages(product, color, files, brandSlug, productSlug);
        });
    }

    // ==================== UPDATE AVATAR ====================
    public void updateImage(Product product, MultipartFile image, String brand, String name) {
        if (isEmpty(image)) return;
        deleteIfExists(product.getImageUrl());
        product.setImageUrl(saveAvatar(image, brand, name));
    }

    // ==================== PRIVATE HELPERS ====================

    private void attachColorImages(Product product, ProductColor color,
                                   List<MultipartFile> files,
                                   String brandSlug, String productSlug) {
        List<ProductImage> images = IntStream.range(0, files.size())
                .mapToObj(i -> buildColorImage(product, color, files.get(i), brandSlug, productSlug, i))
                .toList();
        product.getImages().addAll(images);
    }

    private ProductImage buildColorImage(Product product, ProductColor color,
                                         MultipartFile file,
                                         String brandSlug, String productSlug, int index) {
        String url = imageStorageService.saveVariantImage(
                file, brandSlug, productSlug, color.getColorKey(), index + 1
        );
        ProductImage img = new ProductImage();
        img.setProduct(product);
        img.setColor(color);
        img.setImageUrl(url);
        img.setSortOrder(index);
        return img;
    }

    private String saveAvatar(MultipartFile image, String brand, String name) {
        return imageStorageService.saveAvatar(
                image,
                slugService.slugify(brand),
                slugService.slugify(name)
        );
    }

    private void deleteIfExists(String url) {
        if (url != null && !url.isBlank()) {
            imageStorageService.deleteFileIfExists(url);
        }
    }

    private boolean isEmpty(MultipartFile file) {
        return file == null || file.isEmpty();
    }
}
