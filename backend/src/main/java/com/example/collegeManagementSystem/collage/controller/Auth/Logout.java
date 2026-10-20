package com.example.collegeManagementSystem.collage.controller.Auth;

import com.example.collegeManagementSystem.collage.service.Auth.LogoutService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth/logout")
public class Logout {

    private final LogoutService logoutService;

    @PostMapping()
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response){

        logoutService.logoutUser(request); //session deleted

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


        return ResponseEntity.ok("Log Out Successfully");
    }
}
