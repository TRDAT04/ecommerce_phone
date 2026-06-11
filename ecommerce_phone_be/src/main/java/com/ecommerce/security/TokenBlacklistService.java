package com.ecommerce.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "blacklist:";

    /**
     * Thêm token vào blacklist, tự xóa sau TTL.
     * @param token     JWT access token cần vô hiệu hóa
     * @param ttlMillis thời gian sống còn lại (milliseconds)
     */
    public void blacklist(String token, long ttlMillis) {
        if (ttlMillis <= 0) return;
        try {
            redisTemplate.opsForValue()
                    .set(PREFIX + token, "true", ttlMillis, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.warn("Redis unavailable, could not blacklist token: {}", e.getMessage());
        }
    }

    /**
     * Kiểm tra token có trong blacklist không.
     * Nếu Redis unavailable → trả false (fail-open) để không block toàn bộ API.
     * @param token JWT access token cần kiểm tra
     * @return true nếu token đã bị thu hồi
     */
    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + token));
        } catch (Exception e) {
            log.warn("Redis unavailable, skipping blacklist check: {}", e.getMessage());
            return false; // fail-open: cho phép request đi qua
        }
    }
}
