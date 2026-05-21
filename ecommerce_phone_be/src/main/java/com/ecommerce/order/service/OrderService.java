package com.ecommerce.order.service;


import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderCreationService creationService;
    private final OrderQueryService queryService;
    private final OrderStatusService statusService;
    private final OrderCancelService cancelService;
    private final OrderRepository orderRepository;

    public Order createOrder(OrderRequest req) {
        return creationService.createOrder(req);
    }

    public OrderResponse getById(Long id) {
        return queryService.getById(id);
    }

    public org.springframework.data.domain.Page<OrderResponse> getAll(String status, String phone, org.springframework.data.domain.Pageable pageable) {
        return queryService.getAll(status, phone, pageable);
    }

    public void updateStatus(Long id, String newStatus) {
        statusService.updateStatus(id, newStatus);
    }

    public void cancelOrderForUser(Long id) {
        cancelService.cancelOrderForUser(id);
    }

    public List<TrackOrderMiniDTO> getByPhoneMini(String phone) {
        return queryService.getByPhoneMini(phone);
    }

    public TrackOrderMiniDTO getByOrderCodeAndPhone(String orderCode, String phone) {
        return queryService.getByOrderCodeAndPhone(orderCode, phone);
    }

    public OrderResponse getByOrderCode(String orderCode) {
        return queryService.getByOrderCode(orderCode);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}