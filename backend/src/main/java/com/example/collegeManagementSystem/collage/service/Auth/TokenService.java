package com.example.collegeManagementSystem.collage.service.Auth;


import com.example.collegeManagementSystem.collage.dto.LoginResponseDto;
import com.example.collegeManagementSystem.collage.entity.BaseUserEntity;
import com.example.collegeManagementSystem.collage.entity.SessionEntity;
import com.example.collegeManagementSystem.collage.repository.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenService {

    SessionService sessionService;
    JwtService jwtService;
    SessionRepository sessionRepository;
    UnifiedUserDetailsService unifiedUserDetailsService;


    @Transactional
    public LoginResponseDto refreshToken(String refreshToken) {

        SessionEntity session = sessionService.getValidSession(refreshToken);

        BaseUserEntity user = unifiedUserDetailsService.loadUserByIdAndRole(session.getUserId(), session.getRole());

        sessionRepository.findByRefreshToken(refreshToken).ifPresent(sessionRepository::delete);


        String newRefreshToken = jwtService.generateRefreshToken(user);
        sessionService.createSession(newRefreshToken);

        String newAccessToken = jwtService.generateAccessToken(user);


        return new LoginResponseDto(user.getId(),newAccessToken,newRefreshToken);

    }
}
