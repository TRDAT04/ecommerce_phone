package com.ecommerce.order.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Data
public class OrderRequest {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private String note;

    // Email để nhận xác nhận đơn hàng (không bắt buộc)
    // Nếu đã đăng nhập sẽ lấy email từ tài khoản, trường này dành cho khách vãng lai
    private String email;

    @NotEmpty(message = "Order items cannot be empty")
    @jakarta.validation.Valid
    private List<OrderItemRequest> items;
}