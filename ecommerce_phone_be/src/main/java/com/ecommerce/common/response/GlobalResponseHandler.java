package com.ecommerce.common.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.ecommerce")
public class GlobalResponseHandler implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Không bọc lại nếu kiểu trả về đã là ApiResponse
        return !returnType.getParameterType().equals(ApiResponse.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {

        // Bỏ qua nếu lỗi (sẽ do GlobalExceptionHandler xử lý)
        if (request.getURI().getPath().contains("/error")) {
            return body;
        }

        // Không bọc lại nếu body đã là ApiResponse (tránh double-wrap khi trả ResponseEntity<ApiResponse<T>>)
        if (body instanceof ApiResponse) {
            return body;
        }

        // Nếu body là chuỗi String, phải serialize ra json string để tránh lỗi ClassCastException của Spring
        if (body instanceof String) {
            try {
                return objectMapper.writeValueAsString(ApiResponse.builder()
                        .status(200)
                        .message("Success")
                        .data(body)
                        .build());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

        return ApiResponse.builder()
                .status(200)
                .message("Success")
                .data(body)
                .build();
    }
}
