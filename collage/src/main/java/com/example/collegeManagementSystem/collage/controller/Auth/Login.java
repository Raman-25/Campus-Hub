package com.example.collegeManagementSystem.collage.controller.Auth;


import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorLoginDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentLoginDto;
import com.example.collegeManagementSystem.collage.service.Auth.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/student")
    public ResponseEntity<LoginResponseDto> loginStudent(@RequestBody StudentLoginDto loginDto, HttpServletResponse response){

         LoginResponseDto responseDto = loginService.loginStudent(loginDto);

        Cookie cookie = new Cookie("refreshToken", responseDto.getRefreshToken());
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/professor")
    public ResponseEntity<LoginResponseDto> loginProfessor(@RequestBody ProfessorLoginDto loginDto, HttpServletResponse response){

        LoginResponseDto responseDto = loginService.loginProfessor(loginDto);

        Cookie cookie = new Cookie("refreshToken", responseDto.getRefreshToken());
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(responseDto);
    }
}
