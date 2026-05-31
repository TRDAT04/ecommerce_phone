package com.ecommerce.order.controller;

import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.dto.response.MyOrderDTO;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.service.OrderService;
import com.ecommerce.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
@RequiredArgsConstructor
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @PostMapping
    public Map<String, Object> createOrder(@jakarta.validation.Valid @RequestBody OrderRequest req) {
        Order order = orderService.createOrder(req);

        return Map.of(
                "orderCode", order.getOrderCode()
        );
    }

    @GetMapping("/phone/{phone}")
    public List<TrackOrderMiniDTO> getMiniByPhone(@PathVariable String phone) {
        return orderService.getByPhoneMini(phone);
    }

    @GetMapping("/{orderCode}/track")
    public TrackOrderMiniDTO trackOrder(
            @PathVariable String orderCode,
            @RequestParam String phone) {
        return orderService.getByOrderCodeAndPhone(orderCode, phone);
    }

    @GetMapping("/{orderCode}")
    public OrderResponse getByOrderCode(@PathVariable String orderCode) {
        return orderService.getByOrderCode(orderCode);
    }

    @PutMapping("/{orderCode}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable String orderCode) {
        OrderResponse res = orderService.getByOrderCode(orderCode);
        orderService.cancelOrderForUser(res.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Đơn hàng đã được hủy thành công")
                .build());
    }

    @GetMapping("/user/me")
    public List<MyOrderDTO> getMyOrders(Authentication auth) {

        String email = auth.getName();

        return orderRepository.findMyOrders(email);
    }
}