package com.example.collegeManagementSystem.collage.service.Auth;


import com.example.collegeManagementSystem.collage.entity.SessionEntity;
import com.example.collegeManagementSystem.collage.repository.SessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LogoutService {

    SessionService sessionService;
    private final SessionRepository sessionRepository;

    @Transactional
    public void logoutUser(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new AuthorizationServiceException("Refresh Token Not Found inside Cookie");
        }
        String refreshToken = Arrays.stream(cookies).
                filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(()-> new AuthorizationServiceException("Refresh Token Not Found inside Cookie"));

        SessionEntity session = sessionService.getValidSession(refreshToken);
        sessionRepository.delete(session);

    }
}
