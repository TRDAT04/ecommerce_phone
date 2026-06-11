package com.ecommerce.security;

import com.ecommerce.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {


    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.access-expiration}")
    private long ACCESS_EXPIRATION;

    @Value("${jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION;

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

    // ===== VALIDATE REFRESH TOKEN =====
    public boolean isRefreshTokenValid(String token, User user) {
        try {
            final String username = extractUsername(token);
            final String type = extractTokenType(token);
            return username.equals(user.getEmail())
                    && "refresh".equals(type)  
                    && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Refresh token expired: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Invalid refresh token: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // ===== REMAINING TTL (dùng cho Redis blacklist) =====
    public long getRemainingExpiration(String token) {
        Date expiration = getClaims(token).getExpiration();
        long remaining = expiration.getTime() - System.currentTimeMillis();
        return Math.max(remaining, 0);
    }
}