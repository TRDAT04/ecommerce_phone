package com.ecommerce.order.controller;

import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.service.OrderService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @PostMapping
    public Map<String, Object> createOrder(@RequestBody OrderRequest req) {
        Order order = orderService.createOrder(req);

        return Map.of(
                "orderId", order.getId()
        );
    }

    @GetMapping("/phone/{phone}")
    public List<TrackOrderMiniDTO> getMiniByPhone(@PathVariable String phone) {
        return orderService.getByPhoneMini(phone);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PutMapping("/{id}/cancel")
    public void cancelOrder(@PathVariable Long id) {
        orderService.cancelOrderForUser(id);
    }

    @GetMapping("/user/me")
    public List<Order> getMyOrders(Authentication auth) {
        String email = auth.getName();
        return orderRepository.findByUser_Email(email);
    }
}