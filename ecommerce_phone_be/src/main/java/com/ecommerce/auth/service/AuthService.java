package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AuthRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.common.exception.AppException;
import org.springframework.http.HttpStatus;
import com.ecommerce.security.JwtUtil;
import com.ecommerce.security.RefreshTokenService;
import com.ecommerce.security.TokenBlacklistService;
import com.ecommerce.user.entity.RoleEnum;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final GoogleAuthService googleAuthService;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenService refreshTokenService;

    // ===================== HELPER: tạo token + lưu Redis + trả cookie =====
    public record TokenPair(AuthResponse response, ResponseCookie cookie) {}

    private TokenPair buildTokenPair(User user) {
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        String tokenHash = jwtUtil.hashToken(refreshToken);

        // Lưu hash của refresh token vào Redis
        refreshTokenService.saveRefreshToken(user.getEmail(), tokenHash);

        AuthResponse response = new AuthResponse(accessToken, user.getEmail(), user.getRole().name());
        ResponseCookie cookie = jwtUtil.buildRefreshCookie(refreshToken);
        return new TokenPair(response, cookie);
    }

    // ===================== LOGIN =====================
    public TokenPair login(AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        return buildTokenPair(user);
    }

    // ===================== REGISTER =====================
    public TokenPair register(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new AppException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setRole(RoleEnum.ROLE_USER);
        userRepo.save(user);
        return buildTokenPair(user);
    }

    // ===================== REFRESH TOKEN =====================
    public TokenPair refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        }

        // Bước 1: kiểm tra chữ ký JWT + type + expiry
        if (!jwtUtil.isRefreshTokenValid(refreshToken)) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }

        // Bước 2: tra Redis
        String email = jwtUtil.extractUsername(refreshToken);
        String tokenHash = jwtUtil.hashToken(refreshToken);

        if (!refreshTokenService.validateRefreshToken(email, tokenHash)) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token has been revoked");
        }

        // Bước 3: xóa token cũ (Rotation)
        refreshTokenService.deleteRefreshToken(email, tokenHash);

        // Bước 4: cấp token mới
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        return buildTokenPair(user);
    }

    // ===================== GOOGLE LOGIN =====================
    public TokenPair loginWithGoogle(String idTokenString) {
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(idTokenString);
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(name != null ? name : email.split("@")[0]);
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(RoleEnum.ROLE_USER);
            return userRepo.save(newUser);
        });

        return buildTokenPair(user);
    }

    // ===================== LOGOUT =====================
    public ResponseCookie logout(String authHeader, String refreshToken) {
        // Blacklist access token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7);
            try {
                long remainingTtl = jwtUtil.getRemainingExpiration(accessToken);
                tokenBlacklistService.blacklist(accessToken, remainingTtl);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                // Token đã hết hạn → không cần blacklist
            }
        }

        // Xóa refresh token khỏi Redis
        if (refreshToken != null && !refreshToken.isBlank()) {
            try {
                String email = jwtUtil.extractUsername(refreshToken);
                String tokenHash = jwtUtil.hashToken(refreshToken);
                refreshTokenService.deleteRefreshToken(email, tokenHash);
            } catch (Exception e) {
                // Token không parse được → bỏ qua, vẫn clear cookie
            }
        }

        // Trả về cookie rỗng (MaxAge=0) để trình duyệt xóa cookie
        return jwtUtil.buildClearRefreshCookie();
    }
}