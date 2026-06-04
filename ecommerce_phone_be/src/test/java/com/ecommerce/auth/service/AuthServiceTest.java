package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AuthRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.common.exception.AppException;
import com.ecommerce.security.JwtUtil;
import com.ecommerce.user.entity.RoleEnum;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private GoogleAuthService googleAuthService;

    @InjectMocks
    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setEmail("user@example.com");
        mockUser.setName("Test User");
        mockUser.setPassword("encoded-password");
        mockUser.setRole(RoleEnum.ROLE_USER);
    }

    // ===== LOGIN =====

    @Test
    @DisplayName("login: credentials hợp lệ → trả về AuthResponse có đủ token")
    void login_withValidCredentials_shouldReturnAuthResponse() {
        AuthRequest request = new AuthRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(mockUser)).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(mockUser)).thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getEmail()).isEqualTo("user@example.com");
        assertThat(response.getRole()).isEqualTo(RoleEnum.ROLE_USER.name());

        verify(authManager).authenticate(
                new UsernamePasswordAuthenticationToken("user@example.com", "password123")
        );
    }

    @Test
    @DisplayName("login: email không tồn tại → throw AppException 404")
    void login_withNotFoundEmail_shouldThrowAppException() {
        AuthRequest request = new AuthRequest();
        request.setEmail("ghost@example.com");
        request.setPassword("password123");

        when(userRepo.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("User not found")
                .satisfies(ex -> assertThat(((AppException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    @DisplayName("login: sai password → AuthenticationManager ném exception")
    void login_withWrongPassword_shouldThrowException() {
        AuthRequest request = new AuthRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrong-password");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        // userRepo không được gọi khi auth thất bại
        verify(userRepo, never()).findByEmail(anyString());
    }

    // ===== REGISTER =====

    @Test
    @DisplayName("register: email mới → lưu user và trả về token")
    void register_withNewEmail_shouldSaveUserAndReturnTokens() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("newuser@example.com");
        req.setName("New User");
        req.setPassword("securePass123");
        req.setPhone("0912345678");

        when(userRepo.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("securePass123")).thenReturn("encoded-pass");
        when(userRepo.save(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        AuthResponse response = authService.register(req);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token");

        verify(userRepo).save(any(User.class));
        verify(passwordEncoder).encode("securePass123");
    }

    @Test
    @DisplayName("register: email đã tồn tại → throw AppException 409 CONFLICT")
    void register_withDuplicateEmail_shouldThrowAppException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("user@example.com");
        req.setName("Duplicate");
        req.setPassword("pass");

        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("Email already exists")
                .satisfies(ex -> assertThat(((AppException) ex).getStatus()).isEqualTo(HttpStatus.CONFLICT));

        verify(userRepo, never()).save(any());
    }

    // ===== REFRESH TOKEN =====

    @Test
    @DisplayName("refresh: refresh token hợp lệ → trả về access token mới")
    void refresh_withValidRefreshToken_shouldReturnNewAccessToken() {
        String refreshToken = "valid-refresh-token";

        when(jwtUtil.extractUsername(refreshToken)).thenReturn("user@example.com");
        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.isRefreshTokenValid(refreshToken, mockUser)).thenReturn(true);
        when(jwtUtil.generateToken(mockUser)).thenReturn("new-access-token");

        AuthResponse response = authService.refresh(refreshToken);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isEqualTo(refreshToken); // refresh token giữ nguyên
    }

    @Test
    @DisplayName("refresh: refresh token không hợp lệ → throw AppException")
    void refresh_withInvalidRefreshToken_shouldThrowAppException() {
        String badToken = "invalid-or-expired-token";

        when(jwtUtil.extractUsername(badToken)).thenReturn("user@example.com");
        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.isRefreshTokenValid(badToken, mockUser)).thenReturn(false);

        assertThatThrownBy(() -> authService.refresh(badToken))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("Invalid refresh token");
    }
}
