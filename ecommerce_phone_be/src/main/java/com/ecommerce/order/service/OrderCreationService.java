package com.ecommerce.order.service;

import com.ecommerce.common.exception.AppException;
import org.springframework.http.HttpStatus;
import com.ecommerce.common.service.EmailService;
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
    private final EmailService emailService;

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
        String emailToSend = req.getEmail(); // fallback: email khách vãng lai nhập

        if (auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {

            String email = auth.getName();
            user = userRepository.findByEmail(email).orElse(null);

            // Ưu tiên email tài khoản đăng nhập
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

        // Gửi email xác nhận bất đồng bộ (không ảnh hưởng đến response)
        emailService.sendOrderConfirmation(savedOrder, emailToSend);

        return savedOrder;
    }
}
