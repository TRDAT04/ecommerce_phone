package com.ecommerce.security;

import com.ecommerce.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HexFormat;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.access-expiration}")
    private long ACCESS_EXPIRATION;

    @Value("${jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION;

    @Value("${app.cookie.secure:false}")
    private boolean COOKIE_SECURE;

    private static final String COOKIE_NAME = "refresh_token";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ===== ACCESS TOKEN =====
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("type", "access")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ===== REFRESH TOKEN =====
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ===== COOKIE: tạo cookie chứa refresh token =====
    public ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(COOKIE_SECURE)
                .sameSite(COOKIE_SECURE ? "None" : "Lax")
                .path("/api/auth")
                .maxAge(REFRESH_EXPIRATION / 1000) // milliseconds → seconds
                .build();
    }

    // ===== COOKIE: cookie rỗng để xóa (logout) =====
    public ResponseCookie buildClearRefreshCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(COOKIE_SECURE)
                .sameSite(COOKIE_SECURE ? "None" : "Lax")
                .path("/api/auth")
                .maxAge(0)
                .build();
    }

    // ===== HASH token → dùng làm Redis key =====
    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    // ===== EXTRACT =====
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public String extractTokenType(String token) {
        return getClaims(token).get("type", String.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ===== VALIDATE ACCESS TOKEN =====
    public boolean validateAccessToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            final String type = extractTokenType(token);
            return username.equals(userDetails.getUsername())
                    && "access".equals(type)
                    && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Access token expired: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Invalid access token: {}", e.getMessage());
            return false;
        }
    }

    // ===== VALIDATE REFRESH TOKEN (chữ ký + type + hết hạn chưa) =====
    // Dùng để kiểm tra tính hợp lệ của JWT trước khi tra Redis
    public boolean isRefreshTokenValid(String token) {
        try {
            String type = extractTokenType(token);
            return "refresh".equals(type) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Refresh token expired: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Invalid refresh token signature: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // ===== REMAINING TTL (dùng cho access token blacklist) =====
    public long getRemainingExpiration(String token) {
        Date expiration = getClaims(token).getExpiration();
        long remaining = expiration.getTime() - System.currentTimeMillis();
        return Math.max(remaining, 0);
    }
}