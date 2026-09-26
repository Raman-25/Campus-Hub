package com.example.collegeManagementSystem.collage.advice;

import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleJwtException(JwtException ex) {
        ApiError apiError = new ApiError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(apiError));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleUserNotFound(UsernameNotFoundException ex) {
        ApiError apiError = new ApiError(ex.getMessage(), HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(apiError));
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleNotFound(ResourceNotFoundException ex) {
        ApiError apiError = new ApiError(ex.getMessage(), HttpStatus.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(apiError));
    }

    @ExceptionHandler(AuthorizationServiceException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleAuthServiceException(AuthorizationServiceException ex) {
        ApiError apiError = new ApiError("Refresh token not found, please login again", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(apiError));
    }


}

