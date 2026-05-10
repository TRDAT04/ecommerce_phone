package com.ecommerce.product.repository;


import com.ecommerce.product.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query("SELECT DISTINCT p.brand FROM Product p")
    List<String> findDistinctBrands();

   
    List<Product> findTop8ByNameContainingIgnoreCaseOrderBySoldDesc(String keyword);
}