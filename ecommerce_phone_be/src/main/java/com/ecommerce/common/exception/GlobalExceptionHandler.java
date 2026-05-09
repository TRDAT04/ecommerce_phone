package com.ecommerce.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<?> handleAppException(AppException ex) {

        Map<String, Object> res = new HashMap<>();
        res.put("message", ex.getMessage());
        res.put("errorCode", ex.getCode());
        res.put("status", 400);

        return ResponseEntity.badRequest().body(res);
    }

  
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Internal server error");
        res.put("status", 500);

        return ResponseEntity.status(500).body(res);
    }
}