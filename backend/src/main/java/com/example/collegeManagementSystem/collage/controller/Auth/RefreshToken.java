package com.example.collegeManagementSystem.collage.controller.Auth;


import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.service.Auth.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth/refresh")
public class RefreshToken {

    private final TokenService tokenService;


    @PostMapping
    public ResponseEntity<LoginResponseDto> refreshAccessToken(HttpServletRequest request, HttpServletResponse response){

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new AuthorizationServiceException("Refresh Token Not Found inside Cookie");
        }
        String refreshToken = Arrays.stream(cookies).
                filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(()-> new AuthorizationServiceException("Refresh Token Not Found inside Cookie"));


        LoginResponseDto loginResponseDto = tokenService.refreshToken(refreshToken);

        Cookie cookie = new Cookie("refreshToken", loginResponseDto.getRefreshToken());
        cookie.setHttpOnly(true);
        // "/" = cookie is sent with every request; without it, the cookie only goes to the URL that created it
        cookie.setPath("/");
        response.addCookie(cookie);


        return ResponseEntity.ok(loginResponseDto);
    }
}
