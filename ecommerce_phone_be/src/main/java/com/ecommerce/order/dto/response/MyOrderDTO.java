package com.ecommerce.order.dto.response;

import java.time.LocalDateTime;

public record MyOrderDTO(
        Long id,
        String status,
        Double totalPrice,
        LocalDateTime createdAt
) {
}
