package com.ecommerce.product.service.helper;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ecommerce.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageStorageService {
    private final Cloudinary cloudinary;
    private static final String ROOT = "products";

    public String saveAvatar(MultipartFile file, String brandSlug, String productSlug) {
        return upload(file, ROOT + "/" + brandSlug + "/" + productSlug, "avatar", "avatar image");
    }

    public String saveVariantImage(MultipartFile file, String brandSlug, String productSlug, String colorSlug, int index) {
        return upload(file, ROOT + "/" + brandSlug + "/" + productSlug + "/" + colorSlug, String.valueOf(index), "variant image");
    }

    private String upload(MultipartFile file, String folder, String publicId, String label) {
        try {
            var result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", folder, "public_id", publicId)
            );
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new AppException("Failed to upload " + label);
        }
    }

    public void deleteFileIfExists(String fullUrl) {
        if (fullUrl == null || fullUrl.isBlank()) return;

        int uploadIndex = fullUrl.indexOf("/upload/");
        if (uploadIndex == -1) return;

        try {
            String afterUpload = fullUrl.substring(uploadIndex + "/upload/".length());
            if (afterUpload.matches("^v\\d+/.+")) afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);

            String publicId = afterUpload.replaceFirst("\\.[^.]+$", "");
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("✔ Deleted: " + publicId);
        } catch (Exception e) {
            System.out.println("❌ Failed to delete: " + e.getMessage());
        }
    }
}
