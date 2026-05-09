package com.ecommerce.product.dto.common;

import lombok.Data;

@Data
public class SpecDTO {
    private Long id;
    private String specName;
    private String specValue;
    private String specKey;
}