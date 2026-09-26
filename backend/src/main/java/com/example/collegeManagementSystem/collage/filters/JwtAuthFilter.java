package com.example.collegeManagementSystem.collage.filters;

import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.entity.AdminEntity;
import com.example.collegeManagementSystem.collage.entity.BaseUserEntity;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.AdminRepository;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import com.example.collegeManagementSystem.collage.service.Auth.JwtService;
import com.example.collegeManagementSystem.collage.service.Auth.UnifiedUserDetailsService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtAuthFilter extends OncePerRequestFilter {

    JwtService jwtService;
    UnifiedUserDetailsService unifiedUserDetailsService;
    StudentRepository studentRepository;
    AdminRepository adminRepository;
    ProfessorRepository professorRepository;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver handlerExceptionResolver;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            final String requestTokenHeader = request.getHeader("Authorization");

            if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = requestTokenHeader.substring(7).trim();
            String tokenType = jwtService.getTokenTypeFromToken(token);
            if (!"ACCESS".equals(tokenType)) {
                throw new JwtException("Refresh token cannot be used as access token");
            }
            Long UserId = jwtService.getUserIdFromToken(token);
            String Role = jwtService.getRoleFromToken(token);


            //Authenticated if not
            if (UserId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                BaseUserEntity user = null;

                switch (Role) {
                    case "STUDENT" -> user = studentRepository.findById(UserId).orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + UserId));
                    case "ADMIN" -> user = adminRepository.findById(UserId).orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + UserId));
                    case "PROFESSOR" -> user = professorRepository.findById(UserId).orElseThrow(() -> new ResourceNotFoundException("Professor not found with id: " + UserId));
                    default -> throw new UsernameNotFoundException("Unknown role in token: " + Role);
                }

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                user,     // who is the authenticated user
                                null,     // no password needed
                                user.getAuthorities()  //roles for now
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authenticationToken);
            }

        } catch (Exception ex) {
            handlerExceptionResolver.resolveException(request, response, null, ex);
            return;
        }
        filterChain.doFilter(request, response);
    }

}

