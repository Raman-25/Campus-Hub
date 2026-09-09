package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

}