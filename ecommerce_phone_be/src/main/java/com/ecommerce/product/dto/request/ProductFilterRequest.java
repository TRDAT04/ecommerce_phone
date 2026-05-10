package com.ecommerce.product.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ProductFilterRequest {

    private int page = 0;
    private int size = 20;
    
    private String keyword;
    private List<String> brands;

    private Double minPrice;
    private Double maxPrice;

    private List<String> storage;
    private List<Integer> ram;


    private Integer batteryMin;
    private Integer batteryMax;

    private Double screenMin;
    private Double screenMax;

    private List<Integer> refreshRate;

    private String sort;
}