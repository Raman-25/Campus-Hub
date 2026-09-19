package com.example.collegeManagementSystem.collage.service.Auth;


import com.example.collegeManagementSystem.collage.dto.Admin.adminLoginDto;
import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorLoginDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentLoginDto;
import com.example.collegeManagementSystem.collage.entity.AdminEntity;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public LoginResponseDto loginStudent(StudentLoginDto loginDto) {

        Authentication authentication =  authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(),loginDto.getPassword())
        );

        StudentEntity student = (StudentEntity) authentication.getPrincipal();  //returns the authenticated user object


        String AccessToken = jwtService.generateAccessToken(student.getId(),student.getEmail(), String.valueOf(student.getRole()));
        String RefreshToken = jwtService.generateRefreshToken(student.getId());

        return  new LoginResponseDto(student.getId(),AccessToken,RefreshToken);

    }

    public LoginResponseDto loginProfessor(ProfessorLoginDto loginDto) {
        Authentication authentication =  authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(),loginDto.getPassword())
        );

        ProfessorEntity professor = (ProfessorEntity) authentication.getPrincipal();

        String AccessToken = jwtService.generateAccessToken(professor.getId(),professor.getEmail(), String.valueOf(professor.getRole()));
        String RefreshToken = jwtService.generateRefreshToken(professor.getId());

        return  new LoginResponseDto(professor.getId(),AccessToken,RefreshToken);
    }

    public LoginResponseDto loginAdmin(adminLoginDto loginDto) {
        Authentication authentication =  authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(),loginDto.getPassword())
        );

        AdminEntity admin = (AdminEntity) authentication.getPrincipal();

        String AccessToken = jwtService.generateAccessToken(admin.getId(),admin.getEmail(), String.valueOf(admin.getRole()));
        String RefreshToken = jwtService.generateRefreshToken(admin.getId());

        return  new LoginResponseDto(admin.getId(),AccessToken,RefreshToken);
    }
}
