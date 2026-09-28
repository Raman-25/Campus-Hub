package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<SubjectEntity, Long> {

    List<SubjectEntity> findByDepartmentAndYear(Department department, Integer year);
}