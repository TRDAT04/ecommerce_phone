package com.ecommerce.user.controller;

import com.ecommerce.user.entity.User;
import com.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
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
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // ================= CHANGE PASSWORD (ADMIN) =================
    @PutMapping("/{id}/password")
    public void adminChangePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String newPassword = body.get("password");

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("Password không được để trống");
        }

        userService.adminChangePassword(id, newPassword);
    }
}