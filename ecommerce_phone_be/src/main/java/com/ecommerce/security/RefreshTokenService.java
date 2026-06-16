package com.ecommerce.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION_MS;

    private static final String PREFIX = "refresh:";

    // ===== LƯU token mới vào Redis =====
    public void saveRefreshToken(String email, String tokenHash) {
        String key = buildKey(email, tokenHash);
        try {
            redisTemplate.opsForValue()
                    .set(key, "valid", REFRESH_EXPIRATION_MS, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.warn("Redis unavailable, could not save refresh token: {}", e.getMessage());
        }
    }

    // ===== KIỂM TRA token có tồn tại không =====
    public boolean validateRefreshToken(String email, String tokenHash) {
        String key = buildKey(email, tokenHash);
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.warn("Redis unavailable, skipping refresh token validation: {}", e.getMessage());
            return false; // fail-closed: không cho refresh nếu Redis down
        }
    }

    // ===== XÓA token cụ thể (logout hoặc rotate) =====
    public void deleteRefreshToken(String email, String tokenHash) {
        String key = buildKey(email, tokenHash);
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            log.warn("Redis unavailable, could not delete refresh token: {}", e.getMessage());
        }
    }

    // ===== XÓA TẤT CẢ session của user (đổi mật khẩu, bị hack) =====
    public void deleteAllRefreshTokens(String email) {
        String pattern = PREFIX + email + ":*";
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("Deleted {} refresh token(s) for user: {}", keys.size(), email);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable, could not delete all refresh tokens: {}", e.getMessage());
        }
    }

    private String buildKey(String email, String tokenHash) {
        return PREFIX + email + ":" + tokenHash;
    }
}
