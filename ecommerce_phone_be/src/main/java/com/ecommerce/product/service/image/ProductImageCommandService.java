package com.ecommerce.product.service.image;

import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.repository.ProductImageRepository;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.storage.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductImageCommandService {

    private final ProductRepository productRepository;
    private final ImageStorageService imageStorageService;
    private final SlugService slugService;
    private final ProductImageRepository productImageRepository;

    public ProductImageCommandService(ProductRepository productRepository,
                                      ImageStorageService imageStorageService,
                                      SlugService slugService,
                                      ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.imageStorageService = imageStorageService;
        this.slugService = slugService;
        this.productImageRepository = productImageRepository;
    }

    // ================= UPLOAD =================
    public List<ProductImage> uploadImages(Long productId,
                                           String color,
                                           MultipartFile[] files) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String colorKey = color.trim().toLowerCase();

        String brandSlug = slugService.slugify(product.getBrand());
        String productSlug = slugService.slugify(product.getName());
        String colorSlug = slugService.slugify(colorKey);

        ProductColor pc = product.getColors().stream()
                .filter(c -> c.getColorKey().equalsIgnoreCase(colorKey))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Color not found"));

        int currentSize = (int) product.getImages().stream()
                .filter(img ->
                        img.getColor() != null &&
                                img.getColor().getColorKey().equalsIgnoreCase(colorKey)
                )
                .count();

        List<ProductImage> savedImages = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {

            MultipartFile file = files[i];
            int index = currentSize + i + 1;

            String imageUrl = imageStorageService.saveVariantImage(
                    file,
                    brandSlug,
                    productSlug,
                    colorSlug,
                    index
            );

            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setColor(pc);
            img.setSortOrder(currentSize + i);
            img.setImageUrl(imageUrl);

            savedImages.add(img);
        }

        product.getImages().addAll(savedImages);
        productRepository.save(product);

        return savedImages;
    }

    // ================= DELETE =================
    public void deleteImage(Long imageId) {

        ProductImage img = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (img.getImageUrl() != null && !img.getImageUrl().isBlank()) {
            imageStorageService.deleteFileIfExists(img.getImageUrl());
        }

        Product product = img.getProduct();

        product.getImages().remove(img);
        productImageRepository.delete(img);
    }

    // ================= SORT =================
    public void updateSortOrder(Long productId,
                                String color,
                                List<Long> imageIds) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String colorKey = color.trim().toLowerCase();

        List<ProductImage> images = product.getImages().stream()
                .filter(img ->
                        img.getColor() != null &&
                                img.getColor().getColorKey().equalsIgnoreCase(colorKey)
                )
                .collect(Collectors.toList());

        Map<Long, ProductImage> map = images.stream()
                .collect(Collectors.toMap(ProductImage::getId, img -> img));

        for (int i = 0; i < imageIds.size(); i++) {
            ProductImage img = map.get(imageIds.get(i));
            if (img != null) {
                img.setSortOrder(i);
            }
        }

        productRepository.save(product);
    }
}