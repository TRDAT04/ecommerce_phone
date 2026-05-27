package com.ecommerce.user.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.user.entity.RoleEnum;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    // ================= ADMIN =================

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new AppException("User not found"));
    }


    public User updateUser(Long id, User updated) {

        // Lấy user đang đăng nhập
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepo.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException("Current user not found"));

        // Lấy user bị update
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException("User not found"));

        if (currentUser.getId().equals(user.getId()) &&
                !updated.getRole().equals(currentUser.getRole())) {

            throw new AppException("Không thể tự thay đổi role của chính mình");
        }


        if (user.getRole() == RoleEnum.ROLE_SUPER_ADMIN &&
                currentUser.getRole() != RoleEnum.ROLE_SUPER_ADMIN) {

            throw new AppException("Bạn không có quyền sửa SUPER_ADMIN");
        }


        user.setName(updated.getName());
        user.setPhone(updated.getPhone());
       
        user.setRole(updated.getRole());

        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }


    public void adminChangePassword(Long id, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new AppException("Password không được để trống");
        }

        if (newPassword.length() < 6) {
            throw new AppException("Password phải ít nhất 6 ký tự");
        }
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    // ================= USER =================

    public User updateProfile(String email, User updated) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        user.setName(updated.getName());
        user.setPhone(updated.getPhone());


        return userRepo.save(user);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new AppException("Sai mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }
}