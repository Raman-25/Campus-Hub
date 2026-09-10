package com.example.collegeManagementSystem.collage.controller;


import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping()
public class ProfessorSubjectController {

     private final ProfessorService professorService;


    @PostMapping("/professor/{professorId}/subject/{subjectId}") //to assign a professor with id a subject with subject id
    public void assignSubject(@PathVariable Long professorId, @PathVariable Long subjectId){

        professorService.assignSubject(professorId,subjectId);
    }

    @GetMapping("/professor/{professorId}/subjects")
    public List<SubjectEntity> getProfessorAllSubjects(@PathVariable Long professorId) {
      return  professorService.getProfessorAllSubjects(professorId);
    }

}
