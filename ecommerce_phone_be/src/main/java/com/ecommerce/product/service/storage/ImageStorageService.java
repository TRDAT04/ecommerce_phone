package com.ecommerce.product.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

@Service
@RequiredArgsConstructor
public class ImageStorageService {
    private final Cloudinary cloudinary;

    private final String ROOT = "products";

    // ================= AVATAR =================
    public String saveAvatar(MultipartFile file, String brandSlug, String productSlug) {

        try {
            String folder = ROOT + "/" + brandSlug + "/" + productSlug;

            // upload
            var result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "public_id", "avatar"      // giống tên file cũ
                    )
            );

            return result.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload avatar image", e);
        }
    }

    // ================= VARIANT IMAGE =================
    public String saveVariantImage(MultipartFile file,
                                   String brandSlug,
                                   String productSlug,
                                   String colorSlug,
                                   int index) {

        try {
            String folder = ROOT + "/" + brandSlug + "/" + productSlug + "/" + colorSlug;

            var result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "public_id", String.valueOf(index)  // giữ nguyên số index
                    )
            );

            return result.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload variant image", e);
        }
    }

    public void deleteFileIfExists(String fullUrl) {
        try {
            if (fullUrl == null || fullUrl.isBlank()) return;

            // Ví dụ URL:
            // https://res.cloudinary.com/dcvkq98gc/image/upload/v1736142412/products/apple/iphone-16/color/1.webp

            // 1️⃣ Tách phần sau "/upload/"
            int uploadIndex = fullUrl.indexOf("/upload/");
            if (uploadIndex == -1) return;

            String afterUpload = fullUrl.substring(uploadIndex + "/upload/".length());

            // Nếu có version v123123/, loại bỏ luôn
            // /v1736142412/products/... => remove v1736142412/
            if (afterUpload.matches("^v\\d+/.+")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
            }

            // 2️⃣ Loại bỏ extension (jpg, png, webp…)
            String publicId = afterUpload.replaceFirst("\\.[^.]+$", "");

            // 3️⃣ Gọi Cloudinary để xoá
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            System.out.println("✔ Deleted Cloudinary image: " + publicId);

        } catch (Exception e) {
            System.out.println("❌ Failed to delete Cloudinary image: " + e.getMessage());
        }
    }

    // ================= HELPER =================
    private String getExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }
}