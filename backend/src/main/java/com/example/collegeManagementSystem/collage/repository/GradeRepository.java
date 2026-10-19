package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.GradeEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<GradeEntity, Long> {

    Optional<GradeEntity> findByStudentAndSubject(StudentEntity student, SubjectEntity subject);

    @Modifying
    @Query("delete from GradeEntity g where g.student = :student")
    void deleteGradesByStudent(@Param("student") StudentEntity student);

    @Modifying
    @Query("delete from GradeEntity g where g.subject = :subject")
    void deleteGradesBySubject(@Param("subject") SubjectEntity subject);

}