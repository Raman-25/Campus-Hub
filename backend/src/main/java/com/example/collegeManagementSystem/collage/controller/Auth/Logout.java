package com.example.collegeManagementSystem.collage.controller.Auth;

import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentLoginDto;
import com.example.collegeManagementSystem.collage.service.Auth.LogoutService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);


        return ResponseEntity.ok("Log Out Successfully");
    }
}
