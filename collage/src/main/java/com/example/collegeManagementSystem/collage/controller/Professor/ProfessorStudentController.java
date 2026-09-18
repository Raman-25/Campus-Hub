package com.example.collegeManagementSystem.collage.controller.Professor;


import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping()
public class ProfessorStudentController {

    private final StudentService studentService;

    @PostMapping("/student/{studentId}/professor/{professorId}")
    public void assignProfessorToaStudent(@PathVariable Long studentId, @PathVariable Long professorId){
        studentService.assignProfessorToaStudent(studentId,professorId);
    }

    @GetMapping("/student/{studentId}/professors")
    public List<ProfessorDto>getAllProfessorOfAStudent(@PathVariable Long studentId){
        return studentService.getAllProfessorOfAStudent(studentId);
    }

    @DeleteMapping("/student/{studentId}/professor/{professorId}")
    public void deleteProfessorFromAStudent(@PathVariable Long studentId, @PathVariable Long professorId){
        studentService.deleteProfessorFromAStudent(studentId,professorId);
    }


}
