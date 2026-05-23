package com.ecommerce.common.service;

import com.ecommerce.order.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${brevo.api-key}")
    private String apiKey;

    private final EmailTemplateBuilder emailTemplateBuilder;
    private RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendOrderConfirmation(Order order, String toEmail) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không gửi email xác nhận đơn hàng #{}: email không hợp lệ hoặc trống ({})",
                    order.getOrderCode(), toEmail);
            return;
        }

        String url = "https://api.brevo.com/v3/smtp/email";

        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);


            Map<String, Object> body = new HashMap<>();


            Map<String, String> sender = new HashMap<>();
            sender.put("name", "NextMobile");
            sender.put("email", "ttuongdat@gmail.com");
            body.put("sender", sender);


            Map<String, String> to = new HashMap<>();
            to.put("email", toEmail);
            to.put("name", order.getCustomerName());
            body.put("to", Collections.singletonList(to));


            body.put("subject", "✅ Xác nhận đơn hàng #" + order.getOrderCode() + " - Next Mobile");


            String htmlContent = emailTemplateBuilder.buildOrderConfirmationHtml(order);
            body.put("htmlContent", htmlContent);


            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                log.info("Đã gửi email xác nhận đơn hàng #{} đến {} qua Brevo API thành công!",
                        order.getOrderCode(), toEmail);
            } else {
                log.error("Brevo trả về mã phản hồi không mong muốn: {}", response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Lỗi khi gửi email xác nhận đơn hàng #{} qua Brevo API: {}",
                    order.getOrderCode(), e.getMessage());
        }
    }
}