package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    Optional<StudentEntity>findByEmail(String email);
}