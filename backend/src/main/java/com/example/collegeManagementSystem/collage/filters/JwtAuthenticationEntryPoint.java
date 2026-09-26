package com.example.collegeManagementSystem.collage.filters;


import com.example.collegeManagementSystem.collage.advice.ApiError;
import com.example.collegeManagementSystem.collage.advice.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        ApiError apiError = new ApiError("Authentication required, please login", HttpStatus.UNAUTHORIZED);
        response.getWriter().write(objectMapper.writeValueAsString(new ApiResponse<>(apiError)));
    }
}

