package com.example.collegeManagementSystem.collage.controller;


import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.service.ProfessorService;
import com.example.collegeManagementSystem.collage.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping()
public class ProfessorSubjectController {

     private final ProfessorService professorService;
     private final StudentService studentService;


    @PostMapping("/professor/{professorId}/subject/{subjectId}") //to assign a professor with id a subject with subject id
    public void assignSubject(@PathVariable Long professorId, @PathVariable Long subjectId){

        professorService.assignSubject(professorId,subjectId);
    }

    @GetMapping("/professor/{professorId}/subjects")
    public List<SubjectEntity> getProfessorAllSubjects(@PathVariable Long professorId) {
      return  professorService.getProfessorAllSubjects(professorId);
    }

    @DeleteMapping("/professor/{professorId}/subject/{subjectId}") //to assign a professor with id a subject with subject id
    public void deleteASubjectFromProfessor(@PathVariable Long professorId, @PathVariable Long subjectId){

        professorService.deleteASubjectFromProfessor(professorId,subjectId);
    }

    @GetMapping("/subject/{subjectId}/professor")
    public ProfessorEntity getSubjectProfessor(@PathVariable Long subjectId){
         return professorService.getSubjectProfessor(subjectId);
    }

}
