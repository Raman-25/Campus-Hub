package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Long> {
}