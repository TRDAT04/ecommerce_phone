package com.ecommerce.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AppException extends RuntimeException {

    private final HttpStatus status;

    // Constructor mặc định → 400 Bad Request (backward compatible)
    public AppException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    // Constructor với HTTP status cụ thể
    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}