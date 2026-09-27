package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorListDto;
import com.example.collegeManagementSystem.collage.entity.Users.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Long> {
     Optional<ProfessorEntity> findByEmail(String username);

    List<ProfessorListDto> findByDepartment(Department department);
}