package com.example.collegeManagementSystem.collage.controller.Professor;


import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.service.Professsor.ProfessorService;
import com.example.collegeManagementSystem.collage.service.Student.StudentService;
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
    public List<SubjectDto> getProfessorAllSubjects(@PathVariable Long professorId) {
      return  professorService.getProfessorAllSubjects(professorId);
    }

    @DeleteMapping("/professor/{professorId}/subject/{subjectId}") //to assign a professor with id a subject with subject id
    public void deleteASubjectFromProfessor(@PathVariable Long professorId, @PathVariable Long subjectId){

        professorService.deleteASubjectFromProfessor(professorId,subjectId);
    }

    @GetMapping("/subject/{subjectId}/professor")
    public ProfessorDto getSubjectProfessor(@PathVariable Long subjectId){
         return professorService.getSubjectProfessor(subjectId);
    }

}
