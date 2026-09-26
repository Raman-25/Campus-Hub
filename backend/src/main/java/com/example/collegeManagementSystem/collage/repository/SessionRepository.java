package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<SessionEntity, Long> {

    List<SessionEntity> findByUserIdAndRole(Long userId, String role);

    Optional<SessionEntity> findByRefreshToken(String refreshToken);
}