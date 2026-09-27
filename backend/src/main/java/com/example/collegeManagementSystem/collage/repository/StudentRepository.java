package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    Optional<StudentEntity>findByEmail(String email);

    List<StudentEntity>findByDepartmentAndYear(Department department, Integer year);

}