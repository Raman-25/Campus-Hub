package com.example.collegeManagementSystem.collage.filters;


import com.example.collegeManagementSystem.collage.advice.ApiError;
import com.example.collegeManagementSystem.collage.advice.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
//Handler for when AuthorizationFilter(spring) role conflicts
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;


    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        ApiError apiError = new ApiError("Access denied: you do not have permission to access this resource", HttpStatus.FORBIDDEN);
        response.getWriter().write(objectMapper.writeValueAsString(new ApiResponse<>(apiError)));

    }
}
