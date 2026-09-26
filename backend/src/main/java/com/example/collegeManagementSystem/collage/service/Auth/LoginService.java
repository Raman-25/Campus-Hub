package com.example.collegeManagementSystem.collage.service.Auth;


import com.example.collegeManagementSystem.collage.dto.Admin.adminLoginDto;
import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorLoginDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentLoginDto;
import com.example.collegeManagementSystem.collage.entity.AdminEntity;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public LoginResponseDto loginStudent(StudentLoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        Object principal = authentication.getPrincipal();             // Verify the logged-in user is actually this role before casting —
        if (!(principal instanceof StudentEntity student)) {          //returns the authenticated user object
            throw new BadCredentialsException("Invalid email or password");
        }

        String AccessToken = jwtService.generateAccessToken(student);
        String RefreshToken = jwtService.generateRefreshToken(student);

        return new LoginResponseDto(student.getId(), AccessToken, RefreshToken);

    }

    public LoginResponseDto loginProfessor(ProfessorLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        Object principal = authentication.getPrincipal();             // Verify the logged-in user is actually this role before casting —
        if (!(principal instanceof ProfessorEntity professor)) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String AccessToken = jwtService.generateAccessToken(professor);
        String RefreshToken = jwtService.generateRefreshToken(professor);

        return new LoginResponseDto(professor.getId(), AccessToken, RefreshToken);
    }

    public LoginResponseDto loginAdmin(adminLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AdminEntity admin)) {
            throw new BadCredentialsException("Invalid email or password");
        }


        String AccessToken = jwtService.generateAccessToken(admin);
        String RefreshToken = jwtService.generateRefreshToken(admin);

        return new LoginResponseDto(admin.getId(), AccessToken, RefreshToken);
    }
}
