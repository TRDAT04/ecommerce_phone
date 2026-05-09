package com.ecommerce.product.spec;

import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecs {

    public static Specification<Product> withFilter(ProductFilterRequest f) {
        return (root, query, cb) -> {

            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            // ===== BRAND =====
            if (f.getBrands() != null && !f.getBrands().isEmpty()) {
                predicates.add(root.get("brand").in(f.getBrands()));
            }

            // ===== PRICE =====
            if (f.getMinPrice() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(root.get("minPrice"), f.getMinPrice())
                );
            }

            if (f.getMaxPrice() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(root.get("minPrice"), f.getMaxPrice())
                );
            }

            // ===== JOIN VARIANTS =====
            Join<Product, ProductVariant> variantJoin = null;
            if (
                    (f.getStorage() != null && !f.getStorage().isEmpty())
            ) {
                variantJoin = root.join("variants", JoinType.INNER);
            }

            // ===== STORAGE =====
            if (variantJoin != null && f.getStorage() != null && !f.getStorage().isEmpty()) {
                predicates.add(variantJoin.get("storage").in(f.getStorage()));
            }

            // ===== RAM =====
            if (f.getRam() != null && !f.getRam().isEmpty()) {
                predicates.add(
                        root.get("ram").in(f.getRam())
                );
            }


            if (f.getBatteryMin() != null && f.getBatteryMax() != null) {
                predicates.add(
                        cb.between(root.get("battery"), f.getBatteryMin(), f.getBatteryMax())
                );
            }


            // ===== REFRESH RATE =====
            if (f.getRefreshRate() != null && !f.getRefreshRate().isEmpty()) {
                predicates.add(
                        root.get("refreshRate").in(f.getRefreshRate())
                );
            }
            // ===== SCREEN RANGE =====
            if (f.getScreenMin() != null && f.getScreenMax() != null) {
                predicates.add(
                        cb.between(root.get("screenSize"), f.getScreenMin(), f.getScreenMax())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}