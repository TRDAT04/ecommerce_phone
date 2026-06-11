package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.RefreshTokenRequest;
import com.ecommerce.auth.dto.GoogleLoginRequest;
import com.ecommerce.auth.dto.AuthRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.common.response.ApiResponse;
import com.ecommerce.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

//    @PostMapping("/create-admin")
//    public ResponseEntity<?> createAdmin(@RequestBody RegisterRequest req) {
//        return ResponseEntity.ok(authService.createAdmin(req));
//    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(authService.refresh(req.getRefreshToken()));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest req) {
        return ResponseEntity.ok(authService.loginWithGoogle(req.getIdToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(
            @RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .message("Logged out successfully")
                .build());
    }
}