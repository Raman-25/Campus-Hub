package com.example.collegeManagementSystem.collage.service.Auth;

import com.example.collegeManagementSystem.collage.repository.AdminRepository;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnifiedUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Try to find in Student table first
        UserDetails student = (UserDetails) studentRepository.findByEmail(email).orElse(null);
        if (student != null) {
            return student;
        }

        // Try to find in Professor table
        UserDetails professor = (UserDetails) professorRepository.findByEmail(email).orElse(null);
        if (professor != null) {
            return professor;
        }

        // Try to find in Admin table
        UserDetails admin = (UserDetails) adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            return admin;
        }

        // User not found in any table
        throw new UsernameNotFoundException("User with email '" + email + "' not found");
    }
}