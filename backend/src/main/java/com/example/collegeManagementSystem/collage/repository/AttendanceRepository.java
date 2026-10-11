package com.example.collegeManagementSystem.collage.repository;

import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceEntity;
import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceRecordDto;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceEntity, Long> {

    long countByStudentAndSubject(StudentEntity student, SubjectEntity subject);
    long countByStudentAndSubjectAndPresentTrue(StudentEntity student, SubjectEntity subject);

    Optional<AttendanceEntity> findByStudentAndSubjectAndDate(StudentEntity student, SubjectEntity subject, LocalDate date);

    Optional<AttendanceEntity> findTopBySubjectOrderByDateDesc(SubjectEntity subject);





}