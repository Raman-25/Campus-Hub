package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<SubjectEntity, Long> {

    List<SubjectEntity> findByDepartmentAndYear(Department department, Integer year);
    List<SubjectEntity> findByProfessorId(Long professorId);

}