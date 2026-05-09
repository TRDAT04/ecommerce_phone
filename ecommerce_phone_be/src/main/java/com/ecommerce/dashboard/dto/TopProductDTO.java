package com.ecommerce.dashboard.dto;


import lombok.Data;

@Data

public class TopProductDTO {
    private Long id;
    private String name;
    private Long sold;
    private Double revenue;

    public TopProductDTO(Long id, String name, Long sold, Double revenue) {
        this.id = id;
        this.name = name;
        this.sold = sold;
        this.revenue = revenue;
    }
}