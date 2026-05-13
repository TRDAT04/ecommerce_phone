package com.ecommerce.product.service.helper;

import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductSpecification;
import com.ecommerce.product.entity.ProductVariant;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;


@Service
public class ProductCalculationService {

    public void recalculate(Product product) {
        recalculatePrices(product);
        recalculateSpecs(product);
    }

    // ===== PRICES =====
    private void recalculatePrices(Product product) {
        List<ProductVariant> variants = product.getVariants();

        product.setMinPrice(minVariantDouble(variants, ProductVariant::getPrice));
        product.setMinOriginalPrice(minVariantDouble(variants, ProductVariant::getOriginalPrice));
    }

    private Double minVariantDouble(List<ProductVariant> variants,
                                    java.util.function.Function<ProductVariant, Double> getter) {
        return variants.stream()
                .map(getter)
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    // ===== SPECS =====
    private void recalculateSpecs(Product product) {
        int ram = 0, battery = 0, refreshRate = 0;
        double screenSize = 0;

        for (ProductSpecification spec : product.getSpecifications()) {
            String key = spec.getSpecKey();
            String value = spec.getSpecValue();
            if (key == null || value == null) continue;

            switch (key) {
                case "ram" -> ram = maxInt(ram, parseIntSafe(value));
                case "battery" -> battery = maxInt(battery, parseIntSafe(value));
                case "screen_size" -> screenSize = maxDouble(screenSize, parseDoubleSafe(value));
                case "refresh_rate" -> refreshRate = maxInt(refreshRate, parseIntSafe(value));
            }
        }

        product.setRam(ram == 0 ? null : ram);
        product.setBattery(battery == 0 ? null : battery);
        product.setScreenSize(screenSize == 0 ? null : screenSize);
        product.setRefreshRate(refreshRate == 0 ? null : refreshRate);
    }

    private int maxInt(int current, Integer parsed) {
        return (parsed != null) ? Math.max(current, parsed) : current;
    }

    private double maxDouble(double current, Double parsed) {
        return (parsed != null) ? Math.max(current, parsed) : current;
    }

    // ===== PARSE =====
    private Integer parseIntSafe(String value) {
        String cleaned = value.replaceAll("[^0-9]", "");
        if (cleaned.isEmpty()) return null;
        try {
            return Integer.parseInt(cleaned);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDoubleSafe(String value) {
        String cleaned = value.replaceAll("[^0-9.]", "");
        if (cleaned.isEmpty()) return null;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}