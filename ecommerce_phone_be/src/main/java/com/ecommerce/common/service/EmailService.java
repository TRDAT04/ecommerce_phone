package com.ecommerce.common.service;

import com.ecommerce.order.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplateBuilder emailTemplateBuilder;

    @Async
    public void sendOrderConfirmation(Order order, String toEmail) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không gửi email xác nhận đơn hàng #{}: email không hợp lệ hoặc trống ({})",
                    order.getOrderCode(), toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("✅ Xác nhận đơn hàng #" + order.getOrderCode() + " - Phone Store");
            helper.setText(emailTemplateBuilder.buildOrderConfirmationHtml(order), true);

            mailSender.send(message);
            log.info("Đã gửi email xác nhận đơn hàng #{} đến {}", order.getOrderCode(), toEmail);

        } catch (MessagingException e) {
            log.error("Lỗi gửi email xác nhận đơn hàng #{}: {}", order.getOrderCode(), e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi không xác định khi gửi email đơn hàng #{}: {}", order.getOrderCode(), e.getMessage());
        }
    }
}
