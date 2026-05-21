package com.ecommerce.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrackOrderMiniDTO {
    private Long id;
    private String orderCode;
    private String status;
    private Double totalPrice;
}