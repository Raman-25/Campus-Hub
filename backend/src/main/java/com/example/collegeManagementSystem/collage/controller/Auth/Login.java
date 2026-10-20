package com.example.collegeManagementSystem.collage.controller.Auth;


import com.example.collegeManagementSystem.collage.dto.Admin.adminLoginDto;
import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorLoginDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentLoginDto;
import com.example.collegeManagementSystem.collage.service.Auth.LoginService;
import com.example.collegeManagementSystem.collage.service.Auth.SessionService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth/login")
public class Login {

    private final LoginService loginService;
    private final SessionService sessionService;

    @PostMapping("/student")
    public ResponseEntity<LoginResponseDto> loginStudent(@RequestBody StudentLoginDto loginDto, HttpServletResponse response){

        LoginResponseDto responseDto = loginService.loginStudent(loginDto);

        ResponseCookie cookie = ResponseCookie.from("refreshToken",responseDto.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        sessionService.createSession(responseDto.getRefreshToken());

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/professor")
    public ResponseEntity<LoginResponseDto> loginProfessor(@RequestBody ProfessorLoginDto loginDto, HttpServletResponse response){

        LoginResponseDto responseDto = loginService.loginProfessor(loginDto);

        ResponseCookie cookie = ResponseCookie.from("refreshToken",responseDto.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        sessionService.createSession(responseDto.getRefreshToken());

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/admin")
    public ResponseEntity<LoginResponseDto> loginAdmin(@RequestBody adminLoginDto loginDto, HttpServletResponse response){

        LoginResponseDto responseDto = loginService.loginAdmin(loginDto);

        ResponseCookie cookie = ResponseCookie.from("refreshToken",responseDto.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        sessionService.createSession(responseDto.getRefreshToken());

        return ResponseEntity.ok(responseDto);
    }
}
