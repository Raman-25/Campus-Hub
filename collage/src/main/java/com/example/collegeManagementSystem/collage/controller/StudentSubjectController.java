package com.example.collegeManagementSystem.collage.controller;

import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping()
public class StudentSubjectController {

    private final StudentService studentService;

    @PostMapping("/student/{studentId}/subject/{subjectId}")
    public void assignStudentASubject(@PathVariable Long studentId, @PathVariable Long subjectId){

        studentService.assignStudentASubject(studentId,subjectId);
    }

    @GetMapping("/student/{studentId}/subjects")
    public List<SubjectEntity> getAllSubjectsOfAStudent(@PathVariable Long studentId){
        return studentService.getAllSubjectsOfAStudent(studentId);
    }

    @DeleteMapping("/student/{studentId}/subject/{subjectId}")
    public void deleteSubjectFromAStudent(@PathVariable Long studentId, @PathVariable Long subjectId){
        studentService.deleteSubjectFromAStudent(studentId,subjectId);
    }

}

