package com.ecommerce.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class AppException extends RuntimeException {

    private final String code;

    public AppException(String message) {
        super(message);
        this.code = "BAD_REQUEST";
    }

    public AppException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}