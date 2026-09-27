package com.example.collegeManagementSystem.collage.controller.Admin;


import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorListDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentListDto;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import com.example.collegeManagementSystem.collage.service.Professsor.ProfessorService;
import com.example.collegeManagementSystem.collage.service.Student.StudentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/admin")
public class AdminController {

    private final StudentService studentService;
    private final ProfessorService professorService;


    @GetMapping("/student")
    public ResponseEntity<List<StudentListDto>> getByDepartmentAndYear(@RequestParam Department department, @RequestParam Integer year){

        return ResponseEntity.ok(studentService.getByDepartmentAndYear(department, year));
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id){
        studentService.deleteStudentById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/professor")
    public ResponseEntity<List<ProfessorListDto>> getProfessors(@RequestParam Department department) {
        return ResponseEntity.ok(professorService.getByDepartment(department));
    }

    @DeleteMapping("/professor/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }



}
