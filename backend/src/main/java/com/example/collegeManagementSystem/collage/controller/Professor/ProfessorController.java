package com.example.collegeManagementSystem.collage.controller.Professor;


import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorStudentDto;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorSubjectDto;
import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceMarkRequest;
import com.example.collegeManagementSystem.collage.entity.Grades.GradeMarkRequest;
import com.example.collegeManagementSystem.collage.service.Professsor.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/professor")
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping("/subjects/{subjectId}/students")
    public ResponseEntity<List<ProfessorStudentDto>> getStudentsBySubject(@PathVariable Long subjectId){
       return ResponseEntity.ok(professorService.getStudentsBySubject(subjectId));
    }

    @PostMapping("/attendance")
    public ResponseEntity<Void> markAttendanceByDate(@RequestBody AttendanceMarkRequest request ){
        professorService.markAttendanceByDate(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/grades")
    public ResponseEntity<Void> setGrade(@RequestBody GradeMarkRequest request ){
        professorService.setGrade(request);
        return ResponseEntity.ok().build();
    }

    //FOR FETCHING THE ASSIGNED SUBJECT TO PROFESSOR AND SOME DETAILS
    @GetMapping("/subjects")
    public ResponseEntity<List<ProfessorSubjectDto>> getMySubjects() {
        return ResponseEntity.ok(professorService.getMySubjects());
    }



}
