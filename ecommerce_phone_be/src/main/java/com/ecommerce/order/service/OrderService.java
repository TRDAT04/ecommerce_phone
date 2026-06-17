package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.common.service.EmailService;
import com.ecommerce.order.dto.request.OrderItemRequest;
import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.dto.response.OrderItemResponse;
import com.ecommerce.order.dto.response.OrderResponse;
import com.ecommerce.order.dto.response.TrackOrderMiniDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderDetail;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.product.entity.ProductVariant;
import com.ecommerce.product.repository.ProductVariantRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // ========================================================================
    // 1. QUERY METHODS (LẤY DỮ LIỆU ĐƠN HÀNG)
    // ========================================================================

    public List<TrackOrderMiniDTO> getByPhoneMini(String phone) {
        return orderRepository.findMiniByPhone(phone);
    }

    public TrackOrderMiniDTO getByOrderCodeAndPhone(String orderCode, String phone) {
        return orderRepository.findMiniByOrderCodeAndPhone(orderCode, phone)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại."));
    }

    public OrderResponse getById(Long id) {
        Order order = orderRepository.findFullById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));
        return mapToResponseDetail(order);
    }

    public OrderResponse getByOrderCode(String orderCode) {
        Order order = orderRepository.findFullByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));
        return mapToResponseDetail(order);
    }

    public org.springframework.data.domain.Page<OrderResponse> getAll(String status, String phone, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Order> orders;

        if (status != null) {
            orders = orderRepository.findByStatus(status, pageable);
        } else if (phone != null) {
            orders = orderRepository.findByPhoneContaining(phone, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        return orders.map(this::mapToResponseBasic);
    }

    // ========================================================================
    // 2. COMMAND METHODS (TẠO MỚI, CẬP NHẬT TRẠNG THÁI, HỦY ĐƠN)
    // ========================================================================

    @Transactional
    public Order createOrder(OrderRequest req) {
        Order order = new Order();
        order.setCustomerName(req.getCustomerName());
        order.setPhone(req.getPhone());
        order.setAddress(req.getAddress());
        order.setNote(req.getNote());

        // Lấy thông tin user từ JWT (nếu có đăng nhập)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = null;
        String emailToSend = req.getEmail(); // email khách vãng lai nhập

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String email = auth.getName();
            user = userRepository.findByEmail(email).orElse(null);

            if (user != null && user.getEmail() != null) {
                emailToSend = user.getEmail();
            }
        }

        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderDetail> details = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest item : req.getItems()) {
            ProductVariant variant = variantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Variant not found"));

            int rowsUpdated = variantRepository.decreaseStock(variant.getId(), item.getQuantity());
            if (rowsUpdated == 0) {
                throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Sản phẩm " + variant.getProduct().getName() + " đã hết hàng");
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(variant.getProduct());
            detail.setVariant(variant);
            detail.setQuantity(item.getQuantity());
            detail.setPrice(variant.getPrice());

            total += variant.getPrice() * item.getQuantity();
            details.add(detail);
        }

        order.setTotalPrice(total);
        order.setOrderDetails(details);

        Order savedOrder = orderRepository.save(order);

        // Gửi email xác nhận bất đồng bộ
        emailService.sendOrderConfirmation(savedOrder, emailToSend);

        return savedOrder;
    }

    @Transactional
    public void updateStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));

        String current = order.getStatus();

        if (current.equals("PENDING") && newStatus.equals("CONFIRMED")) {
            order.setStatus("CONFIRMED");
            orderRepository.save(order);

            String email = order.getUser() != null ? order.getUser().getEmail() : null;
            if (email != null) {
                emailService.sendAdminConfirmed(order, email);
            } else {
                log.warn("Không gửi email xác nhận đơn #{}: đơn hàng không có tài khoản liên kết", order.getOrderCode());
            }

        } else if (current.equals("CONFIRMED") && newStatus.equals("SHIPPING")) {
            order.setStatus("SHIPPING");
            orderRepository.save(order);

        } else if (current.equals("SHIPPING") && newStatus.equals("DONE")) {
            for (OrderDetail d : order.getOrderDetails()) {
                ProductVariant v = d.getVariant();
                if (v.getProduct() != null) {
                    var product = v.getProduct();
                    product.setSold(product.getSold() + d.getQuantity());
                }
            }
            order.setStatus("DONE");
            orderRepository.save(order);

        } else if ((current.equals("PENDING") || current.equals("CONFIRMED")) && newStatus.equals("CANCELLED")) {
            cancelOrderAndRestoreStock(order);
        } else {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid status flow");
        }
    }

    @Transactional
    public void cancelOrderForUser(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getStatus().equals("PENDING")) {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot cancel this order");
        }

        cancelOrderAndRestoreStock(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // ========================================================================
    // 3. PRIVATE HELPER METHODS
    // ========================================================================

    private void cancelOrderAndRestoreStock(Order order) {
        for (OrderDetail d : order.getOrderDetails()) {
            ProductVariant v = d.getVariant();
            v.setStock(v.getStock() + d.getQuantity());
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        String email = order.getUser() != null ? order.getUser().getEmail() : null;
        if (email != null) {
            emailService.sendCancelled(order, email);
        } else {
            log.warn("Không gửi email hủy đơn #{}: đơn hàng không có tài khoản liên kết", order.getOrderCode());
        }
    }

    private OrderResponse mapToResponseDetail(Order order) {
        OrderResponse res = mapToResponseBasic(order);

        List<OrderItemResponse> items = order.getOrderDetails().stream().map(d -> {
            OrderItemResponse i = new OrderItemResponse();
            i.setProductName(d.getVariant().getProduct().getName());
            i.setImage(d.getVariant().getProduct().getImageUrl());
            i.setColor(d.getVariant().getColor().getName());
            i.setStorage(d.getVariant().getStorage());
            i.setPrice(d.getPrice());
            i.setQuantity(d.getQuantity());
            return i;
        }).toList();

        res.setItems(items);
        return res;
    }

    private OrderResponse mapToResponseBasic(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderCode(order.getOrderCode());
        res.setCustomerName(order.getCustomerName());
        res.setPhone(order.getPhone());
        res.setAddress(order.getAddress());
        res.setStatus(order.getStatus());
        res.setTotalPrice(order.getTotalPrice());
        res.setCreatedAt(order.getCreatedAt());
        return res;
    }
}