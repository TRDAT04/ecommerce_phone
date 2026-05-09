package com.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "product_specifications")
public class ProductSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specName;

    @Column(columnDefinition = "TEXT")
    private String specValue;
    private String specKey;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}