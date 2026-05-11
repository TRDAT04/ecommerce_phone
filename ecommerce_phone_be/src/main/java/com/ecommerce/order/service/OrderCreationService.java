package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.order.dto.request.OrderItemRequest;
import com.ecommerce.order.dto.request.OrderRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderDetail;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.product.entity.ProductVariant;
import com.ecommerce.product.repository.ProductVariantRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderCreationService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest req) {

        Order order = new Order();
        order.setCustomerName(req.getCustomerName());
        order.setPhone(req.getPhone());
        order.setAddress(req.getAddress());
        order.setNote(req.getNote());

        // USER từ JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = null;

        if (auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {

            String email = auth.getName();
            user = userRepository.findByEmail(email).orElse(null);
        }

        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderDetail> details = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest item : req.getItems()) {

            ProductVariant variant = variantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new AppException("Variant not found"));

            if (variant.getStock() < item.getQuantity()) {
                throw new AppException("Sản phẩm không đủ hàng");
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(variant.getProduct());
            detail.setVariant(variant);
            detail.setQuantity(item.getQuantity());
            detail.setPrice(variant.getPrice());

            total += variant.getPrice() * item.getQuantity();

            variant.setStock(variant.getStock() - item.getQuantity());

            details.add(detail);
        }

        order.setTotalPrice(total);
        order.setOrderDetails(details);

        return orderRepository.save(order);
    }
}