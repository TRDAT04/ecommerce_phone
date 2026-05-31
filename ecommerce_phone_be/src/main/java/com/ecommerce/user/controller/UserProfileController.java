package com.ecommerce.user.controller;


import com.ecommerce.common.exception.AppException;
import com.ecommerce.common.response.ApiResponse;
import com.ecommerce.user.dto.ChangePasswordRequest;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import com.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;
    private final UserService userService;

    // ================= GET PROFILE =================
    @GetMapping("/me")
    public User getCurrentUser(Principal principal) {
        String email = principal.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/me")
    public User updateProfile(@RequestBody User updated, Principal principal) {
        String email = principal.getName();
        return userService.updateProfile(email, updated);
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest req, Principal principal) {
        String email = principal.getName();

        userService.changePassword(
                email,
                req.getOldPassword(),
                req.getNewPassword()
        );

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Đổi mật khẩu thành công")
                .build());
    }
}