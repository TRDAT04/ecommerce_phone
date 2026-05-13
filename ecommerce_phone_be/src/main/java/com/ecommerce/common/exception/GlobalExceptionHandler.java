package com.ecommerce.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<com.ecommerce.common.response.ApiResponse<?>> handleAppException(AppException ex) {
        return ResponseEntity.badRequest().body(com.ecommerce.common.response.ApiResponse.builder()
                .status(400)
                .message(ex.getMessage())
                .build());
    }


    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<com.ecommerce.common.response.ApiResponse<?>> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(com.ecommerce.common.response.ApiResponse.builder()
                .status(400)
                .message("Validation failed")
                .errors(errors)
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<com.ecommerce.common.response.ApiResponse<?>> handleException(Exception ex) {
        return ResponseEntity.status(500).body(com.ecommerce.common.response.ApiResponse.builder()
                .status(500)
                .message("Internal server error")
                .build());
    }
}
