package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Long> {
     Optional<ProfessorEntity> findByEmail(String username);
}