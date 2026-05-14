package com.ecommerce.order.controller;

import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public org.springframework.data.domain.Page<OrderResponse> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String phone,
            @org.springframework.data.web.PageableDefault(size = 500, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) org.springframework.data.domain.Pageable pageable
    ) {
        return orderService.getAll(status, phone, pageable);
    }


    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Long id) {
        return orderService.getById(id);
    }


    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id,
                             @RequestBody Map<String, String> body) {
        orderService.updateStatus(id, body.get("status"));
    }
}