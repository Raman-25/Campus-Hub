package com.example.collegeManagementSystem.collage.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {

    private Long id;
    private String accessToken;
    private String refreshToken;

}
