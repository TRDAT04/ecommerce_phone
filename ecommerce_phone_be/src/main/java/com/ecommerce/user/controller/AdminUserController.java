package com.ecommerce.user.controller;

import com.ecommerce.common.response.ApiResponse;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    // ================= GET ALL =================
    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // ================= UPDATE USER INFO =================
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ) {
        return userService.updateUser(id, updatedUser);
    }

    // ================= DELETE USER =================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Đã xóa người dùng thành công")
                .build());
    }

    // ================= CHANGE PASSWORD (ADMIN) =================
    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse<Void>> adminChangePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        userService.adminChangePassword(id, body.get("password"));
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Đổi mật khẩu thành công")
                .build());
    }
}