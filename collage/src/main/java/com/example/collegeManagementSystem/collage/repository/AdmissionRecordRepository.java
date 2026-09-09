package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.AdmissionRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmissionRecordRepository extends JpaRepository<AdmissionRecordEntity, Long> {
}