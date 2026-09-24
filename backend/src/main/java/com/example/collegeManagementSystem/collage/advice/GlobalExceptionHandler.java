package com.example.collegeManagementSystem.collage.advice;

import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleJwtException(JwtException ex) {
        ApiError apiError = new ApiError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(apiError));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }
}

