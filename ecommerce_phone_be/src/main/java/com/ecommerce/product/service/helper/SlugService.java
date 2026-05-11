package com.ecommerce.product.service.helper;

import org.springframework.stereotype.Service;

import java.text.Normalizer;

@Service
public class SlugService {

    public String slugify(String input) {
        if (input == null) return "unknown";

        input = input.replace("đ", "d").replace("Đ", "D");

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String withoutAccent = normalized.replaceAll("\\p{M}", "");

        String slug = withoutAccent.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("(^-|-$)", "");

        return slug;
    }


}