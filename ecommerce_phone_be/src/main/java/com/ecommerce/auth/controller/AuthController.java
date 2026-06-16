package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AuthRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.GoogleLoginRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.service.AuthService;
import com.ecommerce.common.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ==================== HELPER ====================
    private ResponseEntity<AuthResponse> buildAuthResponse(
            AuthService.TokenPair pair, HttpServletResponse response) {
        // Đặt HttpOnly cookie vào header response
        response.addHeader(HttpHeaders.SET_COOKIE, pair.cookie().toString());
        return ResponseEntity.ok(pair.response());
    }

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest req,
            HttpServletResponse response) {
        return buildAuthResponse(authService.login(req), response);
    }

    // ==================== REGISTER ====================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest req,
            HttpServletResponse response) {
        return buildAuthResponse(authService.register(req), response);
    }

    // ==================== GOOGLE LOGIN ====================
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleLoginRequest req,
            HttpServletResponse response) {
        return buildAuthResponse(authService.loginWithGoogle(req.getIdToken()), response);
    }

    // ==================== REFRESH ====================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        return buildAuthResponse(authService.refresh(refreshToken), response);
    }

    // ==================== LOGOUT ====================
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        ResponseCookie clearCookie = authService.logout(authHeader, refreshToken);
        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .message("Logged out successfully")
                .build());
    }
}