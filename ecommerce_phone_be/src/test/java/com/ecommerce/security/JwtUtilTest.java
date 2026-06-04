package com.ecommerce.security;

import com.ecommerce.user.entity.RoleEnum;
import com.ecommerce.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("JwtUtil Tests")
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;

    // Secret phải đủ 256-bit (32+ chars) cho HS256
    private static final String TEST_SECRET = "my-super-secret-key-for-testing-only-32chars!!";
    private static final long ACCESS_EXP  = 900_000L;   // 15 phút
    private static final long REFRESH_EXP = 86_400_000L; // 1 ngày

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Inject @Value fields vì không load Spring context
        ReflectionTestUtils.setField(jwtUtil, "SECRET", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "ACCESS_EXPIRATION", ACCESS_EXP);
        ReflectionTestUtils.setField(jwtUtil, "REFRESH_EXPIRATION", REFRESH_EXP);

        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setPassword("encoded-password");
        testUser.setRole(RoleEnum.ROLE_USER);
    }

    // ===== generateToken =====

    @Test
    @DisplayName("generateToken: subject phải là email của user")
    void generateToken_shouldContainEmailAsSubject() {
        String token = jwtUtil.generateToken(testUser);
        String extracted = jwtUtil.extractUsername(token);

        assertThat(extracted).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("generateToken: claim 'type' phải là 'access'")
    void generateToken_shouldHaveAccessType() {
        String token = jwtUtil.generateToken(testUser);
        String type = jwtUtil.extractTokenType(token);

        assertThat(type).isEqualTo("access");
    }

    @Test
    @DisplayName("generateToken: claim 'role' phải khớp với role của user")
    void generateToken_shouldContainCorrectRole() {
        String token = jwtUtil.generateToken(testUser);
        String role = jwtUtil.extractRole(token);

        assertThat(role).isEqualTo(RoleEnum.ROLE_USER.name());
    }

    // ===== generateRefreshToken =====

    @Test
    @DisplayName("generateRefreshToken: claim 'type' phải là 'refresh'")
    void generateRefreshToken_shouldHaveRefreshType() {
        String token = jwtUtil.generateRefreshToken(testUser);
        String type = jwtUtil.extractTokenType(token);

        assertThat(type).isEqualTo("refresh");
    }

    @Test
    @DisplayName("generateRefreshToken: subject phải là email của user")
    void generateRefreshToken_shouldContainEmailAsSubject() {
        String token = jwtUtil.generateRefreshToken(testUser);
        String extracted = jwtUtil.extractUsername(token);

        assertThat(extracted).isEqualTo("test@example.com");
    }

    // ===== validateAccessToken =====

    @Test
    @DisplayName("validateAccessToken: token hợp lệ + đúng user → true")
    void validateAccessToken_withValidToken_shouldReturnTrue() {
        String token = jwtUtil.generateToken(testUser);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("test@example.com")
                .password("irrelevant")
                .roles("USER")
                .build();

        boolean valid = jwtUtil.validateAccessToken(token, userDetails);

        assertThat(valid).isTrue();
    }

    @Test
    @DisplayName("validateAccessToken: đúng token nhưng sai user → false")
    void validateAccessToken_withWrongUser_shouldReturnFalse() {
        String token = jwtUtil.generateToken(testUser);
        UserDetails otherUser = org.springframework.security.core.userdetails.User
                .withUsername("other@example.com")
                .password("irrelevant")
                .roles("USER")
                .build();

        boolean valid = jwtUtil.validateAccessToken(token, otherUser);

        assertThat(valid).isFalse();
    }

    @Test
    @DisplayName("validateAccessToken: dùng refresh token thay vì access token → false")
    void validateAccessToken_withRefreshToken_shouldReturnFalse() {
        String refreshToken = jwtUtil.generateRefreshToken(testUser);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("test@example.com")
                .password("irrelevant")
                .roles("USER")
                .build();

        boolean valid = jwtUtil.validateAccessToken(refreshToken, userDetails);

        assertThat(valid).isFalse();
    }

    // ===== isRefreshTokenValid =====

    @Test
    @DisplayName("isRefreshTokenValid: refresh token hợp lệ + đúng user → true")
    void isRefreshTokenValid_withValidToken_shouldReturnTrue() {
        String refreshToken = jwtUtil.generateRefreshToken(testUser);

        boolean valid = jwtUtil.isRefreshTokenValid(refreshToken, testUser);

        assertThat(valid).isTrue();
    }

    @Test
    @DisplayName("isRefreshTokenValid: dùng access token thay vì refresh token → false")
    void isRefreshTokenValid_withAccessToken_shouldReturnFalse() {
        String accessToken = jwtUtil.generateToken(testUser);

        boolean valid = jwtUtil.isRefreshTokenValid(accessToken, testUser);

        assertThat(valid).isFalse();
    }
}
