package com.example.collegeManagementSystem.collage.service.Auth;

import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.entity.SessionEntity;
import com.example.collegeManagementSystem.collage.repository.AdminRepository;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.SessionRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SessionService {

     SessionRepository sessionRepository;
     StudentRepository studentRepository;
     AdminRepository adminRepository;
     ProfessorRepository professorRepository;
     JwtService jwtService;

    private static final int SESSION_LIMIT_STUDENT_PROF = 3;
    private static final int SESSION_LIMIT_ADMIN = 1;
    private static final int REFRESH_TOKEN_VALIDITY_DAYS = 7;


    @Transactional
    public void createSession(String refreshToken){

        Long userId = jwtService.getUserIdFromToken(refreshToken);
        String role = jwtService.getRoleFromToken(refreshToken);

        switch (role) {
            case "STUDENT" -> studentRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + userId));
            case "PROFESSOR" -> professorRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Professor not found with id: " + userId));
            case "ADMIN" -> adminRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + userId));
            default -> throw new UsernameNotFoundException("Unknown role in token: " + role);
        }

        int limit;
        if (role.equals("ADMIN")) {
            limit = SESSION_LIMIT_ADMIN;       // 1
        } else {
            limit = SESSION_LIMIT_STUDENT_PROF; // 3
        }

        List<SessionEntity> sessions = sessionRepository.findByUserIdAndRole(userId, role);

        if (sessions.size() >= limit) {
            sessions.sort(Comparator.comparing(SessionEntity::getLastUsedAt));

            SessionEntity leastRecentlyUsed = sessions.getFirst();
            sessionRepository.delete(leastRecentlyUsed);
        }

        SessionEntity newSession =  SessionEntity.builder()
                .userId(userId)
                .role(role)
                .refreshToken(refreshToken)
                .expiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_VALIDITY_DAYS))
                .build();

        sessionRepository.save(newSession);
    }


    public SessionEntity getValidSession(String refreshToken) {
        SessionEntity session = sessionRepository.findByRefreshToken(refreshToken).orElseThrow(()->
                new ResourceNotFoundException("Session not found, please login again"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            sessionRepository.delete(session);
            throw new ResourceNotFoundException("Session expired, please login again");
        }
        return session;
    }
}

