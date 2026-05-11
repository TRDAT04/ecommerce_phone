package com.ecommerce.product.spec;

import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ProductSpecs {

    private ProductSpecs() {
    }

    public static Specification<Product> withFilter(ProductFilterRequest f) {
        return (root, query, cb) -> {

            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            // ===== KEYWORD =====
            if (hasText(f.getKeyword())) {
                String kw = "%" + f.getKeyword().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), kw));
            }

            // ===== BRAND =====
            if (notEmpty(f.getBrands())) {
                predicates.add(root.get("brand").in(f.getBrands()));
            }

            // ===== PRICE =====
            if (f.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("minPrice"), f.getMinPrice()));
            }
            if (f.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("minPrice"), f.getMaxPrice()));
            }

            // ===== STORAGE (join variant ) =====
            if (notEmpty(f.getStorage())) {
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.INNER);
                predicates.add(variantJoin.get("storage").in(f.getStorage()));
            }

            // ===== RAM =====
            if (notEmpty(f.getRam())) {
                predicates.add(root.get("ram").in(f.getRam()));
            }

            // ===== BATTERY RANGE =====
            if (f.getBatteryMin() != null && f.getBatteryMax() != null) {
                predicates.add(cb.between(root.get("battery"), f.getBatteryMin(), f.getBatteryMax()));
            }

            // ===== REFRESH RATE =====
            if (notEmpty(f.getRefreshRate())) {
                predicates.add(root.get("refreshRate").in(f.getRefreshRate()));
            }

            // ===== SCREEN RANGE =====
            if (f.getScreenMin() != null && f.getScreenMax() != null) {
                predicates.add(cb.between(root.get("screenSize"), f.getScreenMin(), f.getScreenMax()));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    // ===== GUARDS =====
    private static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    private static boolean notEmpty(Collection<?> c) {
        return c != null && !c.isEmpty();
    }
}