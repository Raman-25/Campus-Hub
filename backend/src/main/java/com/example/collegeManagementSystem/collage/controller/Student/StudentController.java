package com.example.collegeManagementSystem.collage.controller.Student;


import com.example.collegeManagementSystem.collage.dto.Student.StudentAttendanceDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentProfileDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentSubjectDto;
import com.example.collegeManagementSystem.collage.service.Student.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/student")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDto> getMyProfile() {
        return ResponseEntity.ok(studentService.getMyProfile());
    }

    @GetMapping("/subjects/{subjectId}/attendance")
    public ResponseEntity<List<StudentAttendanceDto>> getMyAttendanceHistory(
            @PathVariable Long subjectId,
            @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(studentService.getMyAttendanceHistory(subjectId, date));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<StudentSubjectDto>> getMySubjects() {
        return ResponseEntity.ok(studentService.getMySubjects());
    }
}


