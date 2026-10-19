package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceEntity, Long> {

    long countByStudentAndSubject(StudentEntity student, SubjectEntity subject);
    long countByStudentAndSubjectAndPresentTrue(StudentEntity student, SubjectEntity subject);

    Optional<AttendanceEntity> findByStudentAndSubjectAndDate(StudentEntity student, SubjectEntity subject, LocalDate date);

    Optional<AttendanceEntity> findTopBySubjectOrderByDateDesc(SubjectEntity subject);

    List<AttendanceEntity>findByStudentAndSubjectOrderByDateDesc(StudentEntity student, SubjectEntity subject);

    @Modifying
    @Query("delete from AttendanceEntity a where a.student = :student")
    void deleteAttendancesByStudent(@Param("student") StudentEntity student);

    @Modifying
    @Query("delete from AttendanceEntity a where a.subject = :subject")
    void deleteAttendancesBySubject(@Param("subject") SubjectEntity subject);
}