package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<SubjectEntity, Long> {
}