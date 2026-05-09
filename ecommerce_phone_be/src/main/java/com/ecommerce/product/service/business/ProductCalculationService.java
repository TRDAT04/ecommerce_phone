package com.ecommerce.product.service.business;

import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductSpecification;
import com.ecommerce.product.entity.ProductVariant;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ProductCalculationService {

    public void recalculate(Product product) {

        // ===== 1) MIN PRICE =====
        Double minPrice = product.getVariants()
                .stream()
                .map(ProductVariant::getPrice)
                .filter(Objects::nonNull)
                .min(Double::compareTo)
                .orElse(null);

        product.setMinPrice(minPrice);

        Double minOriginalPrice = product.getVariants()
                .stream()
                .map(ProductVariant::getOriginalPrice)
                .filter(Objects::nonNull)
                .min(Double::compareTo)
                .orElse(null);

        product.setMinOriginalPrice(minOriginalPrice);
        // ===== 2) SPEC AGGREGATE =====
        Integer ram = null;
        Integer battery = null;
        Double screenSize = null;
        String chip = null;
        Integer refreshRate = null;

        for (ProductSpecification spec : product.getSpecifications()) {

            String key = spec.getSpecKey();
            String value = spec.getSpecValue();

            if (key == null || value == null) continue;

            switch (key) {

                case "ram": {
                    Integer parsed = parseIntSafe(value);
                    if (parsed != null)
                        ram = (ram == null) ? parsed : Math.max(ram, parsed);
                    break;
                }

                case "battery": {
                    Integer parsed = parseIntSafe(value);
                    if (parsed != null)
                        battery = (battery == null) ? parsed : Math.max(battery, parsed);
                    break;
                }

                case "screen_size": {
                    Double parsed = parseDoubleSafe(value);
                    if (parsed != null)
                        screenSize = (screenSize == null) ? parsed : Math.max(screenSize, parsed);
                    break;
                }


                case "refresh_rate": {
                    Integer parsed = parseIntSafe(value);
                    if (parsed != null)
                        refreshRate = (refreshRate == null) ? parsed : Math.max(refreshRate, parsed);
                    break;
                }

                default:
                    // không làm gì
                    break;
            }
        }

        // ===== 3) UPDATE PRODUCT =====
        product.setRam(ram);
        product.setBattery(battery);
        product.setScreenSize(screenSize);
        product.setRefreshRate(refreshRate);
    }

    // ===== SUPPORT PARSE =====
    private Integer parseIntSafe(String value) {
        try {
            return Integer.parseInt(value.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return null;
        }
    }

    private Double parseDoubleSafe(String value) {
        try {
            String cleaned = value.replaceAll("[^0-9.]", "");
            return Double.parseDouble(cleaned);
        } catch (Exception e) {
            return null;
        }
    }
}