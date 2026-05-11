package com.ecommerce.product.service.image;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.entity.ProductImage;
import com.ecommerce.product.repository.ProductImageRepository;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.storage.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ProductImageCommandService {

    private final ProductRepository productRepository;
    private final ImageStorageService imageStorageService;
    private final SlugService slugService;
    private final ProductImageRepository productImageRepository;

    // ================= UPLOAD =================
    @Transactional
    public List<ProductImage> uploadImages(Long productId, String color, MultipartFile[] files) {

        Product product = findProductById(productId);
        String colorKey = normalizeColor(color);
        ProductColor pc = findProductColor(product, colorKey);

        String brandSlug = slugService.slugify(product.getBrand());
        String productSlug = slugService.slugify(product.getName());
        String colorSlug = slugService.slugify(colorKey);

        int offset = countExistingImages(product, colorKey);

        List<ProductImage> newImages = IntStream.range(0, files.length)
                .mapToObj(i -> buildProductImage(
                        product, pc, files[i],
                        brandSlug, productSlug, colorSlug,
                        offset + i
                ))
                .collect(Collectors.toList());

        product.getImages().addAll(newImages);
        productRepository.save(product);

        return newImages;
    }

    // ================= DELETE =================
    @Transactional
    public void deleteImage(Long imageId) {

        ProductImage img = findImageById(imageId);

        if (hasValidUrl(img)) {
            imageStorageService.deleteFileIfExists(img.getImageUrl());
        }

        img.getProduct().getImages().remove(img);
        productImageRepository.delete(img);
    }

    // ================= SORT =================
    @Transactional
    public void updateSortOrder(Long productId, String color, List<Long> imageIds) {

        Product product = findProductById(productId);
        String colorKey = normalizeColor(color);

        Map<Long, ProductImage> imageMap = product.getImages().stream()
                .filter(img -> hasColor(img, colorKey))
                .collect(Collectors.toMap(ProductImage::getId, Function.identity()));

        IntStream.range(0, imageIds.size())
                .filter(i -> imageMap.containsKey(imageIds.get(i)))
                .forEach(i -> imageMap.get(imageIds.get(i)).setSortOrder(i));

        productRepository.save(product);
    }

    // ================= PRIVATE HELPERS =================

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found"));
    }

    private ProductImage findImageById(Long id) {
        return productImageRepository.findById(id)
                .orElseThrow(() -> new AppException("Image not found"));
    }

    private ProductColor findProductColor(Product product, String colorKey) {
        return product.getColors().stream()
                .filter(c -> c.getColorKey().equalsIgnoreCase(colorKey))
                .findFirst()
                .orElseThrow(() -> new AppException("Color not found"));
    }

    private String normalizeColor(String color) {
        return color.trim().toLowerCase();
    }

    private boolean hasColor(ProductImage img, String colorKey) {
        return img.getColor() != null
                && img.getColor().getColorKey().equalsIgnoreCase(colorKey);
    }

    private int countExistingImages(Product product, String colorKey) {
        return (int) product.getImages().stream()
                .filter(img -> hasColor(img, colorKey))
                .count();
    }

    private boolean hasValidUrl(ProductImage img) {
        return img.getImageUrl() != null && !img.getImageUrl().isBlank();
    }

    private ProductImage buildProductImage(Product product, ProductColor pc,
                                           MultipartFile file,
                                           String brandSlug, String productSlug, String colorSlug,
                                           int index) {
        String url = imageStorageService.saveVariantImage(
                file, brandSlug, productSlug, colorSlug, index + 1
        );

        ProductImage img = new ProductImage();
        img.setProduct(product);
        img.setColor(pc);
        img.setSortOrder(index);
        img.setImageUrl(url);
        return img;
    }
}