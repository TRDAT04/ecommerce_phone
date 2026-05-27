package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AuthRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.common.exception.AppException;
import com.ecommerce.security.JwtUtil;
import com.ecommerce.user.entity.RoleEnum;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
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

    // ===================== LOGIN =====================

    public AuthResponse login(AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        // Lấy user
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("User not found"));

        // Tạo token
        String access = jwtUtil.generateToken(user);
        String refresh = jwtUtil.generateRefreshToken(user);

        return new AuthResponse(
                access,
                refresh,
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ===================== REGISTER =====================
    public AuthResponse register(RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new AppException("Email already exists");
        }
        // Tạo user mới
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setRole(RoleEnum.ROLE_USER);

        userRepo.save(user);

        // Tạo token sau đăng ký
        String access = jwtUtil.generateToken(user);
        String refresh = jwtUtil.generateRefreshToken(user);

        return new AuthResponse(
                access,
                refresh,
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ===================== REFRESH TOKEN =====================
    public AuthResponse refresh(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        if (!jwtUtil.isRefreshTokenValid(refreshToken, user)) {
            throw new AppException("Invalid refresh token");
        }

        String newAccess = jwtUtil.generateToken(user);

        return new AuthResponse(
                newAccess,
                refreshToken,
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ===================== GOOGLE LOGIN =====================
    public AuthResponse loginWithGoogle(String idTokenString) {
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(idTokenString);
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepo.findByEmail(email).orElseGet(() -> {
            // Create new user if not exists
            User newUser = new User();
            newUser.setName(name != null ? name : email.split("@")[0]);
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(RoleEnum.ROLE_USER);
            return userRepo.save(newUser);
        });

        // Generate tokens
        String access = jwtUtil.generateToken(user);
        String refresh = jwtUtil.generateRefreshToken(user);

        return new AuthResponse(
                access,
                refresh,
                user.getEmail(),
                user.getRole().name()
        );
    }

}