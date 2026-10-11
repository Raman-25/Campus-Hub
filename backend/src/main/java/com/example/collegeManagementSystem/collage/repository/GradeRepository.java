package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.Enum.Grade;
import com.example.collegeManagementSystem.collage.entity.GradeEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<GradeEntity, Long> {

    Optional<GradeEntity> findByStudentAndSubject(StudentEntity student, SubjectEntity subject);

}