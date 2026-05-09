package com.ecommerce.dashboard.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDTO {
    private String month; // "2026-04"
    private double revenue;
}