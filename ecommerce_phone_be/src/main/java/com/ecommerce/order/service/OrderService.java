package com.ecommerce.order.service;


import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
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

    public Order createOrder(OrderRequest req) {
        return creationService.createOrder(req);
    }

    public OrderResponse getById(Long id) {
        return queryService.getById(id);
    }

    public List<OrderResponse> getAll(String status, String phone) {
        return queryService.getAll(status, phone);
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
}