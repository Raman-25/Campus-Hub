package com.example.collegeManagementSystem.collage.controller.Subject;


import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectListDto;
import com.example.collegeManagementSystem.collage.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/admin/subject")
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public SubjectDto createNewSubject(@RequestBody SubjectDto subjectDto) {
        return subjectService.createNewSubject(subjectDto);
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<Void> deleteSubjectById(@PathVariable Long subjectId) {
        subjectService.deleteSubjectById(subjectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{subjectId}")
    public SubjectDto getSubjectById(@PathVariable(name = "subjectId") Long subjectId) {
        return subjectService.getSubjectById(subjectId);
    }
    @PutMapping("/{subjectId}")
    public SubjectDto updateSubjectById(
            @PathVariable Long subjectId,
            @RequestBody SubjectDto subjectDto) {
        return subjectService.updateSubjectById(subjectDto, subjectId);
    }

    @GetMapping(params = {"department", "year"})
    public ResponseEntity<List<SubjectListDto>> getSubjectsByDepartmentAndYear(
            @RequestParam Department department,
            @RequestParam Integer year) {
        return ResponseEntity.ok(subjectService.getSubjectsByDepartmentAndYear(department, year));
    }

    @DeleteMapping("/{subjectId}/assign")
    public ResponseEntity<SubjectListDto> unassignProfessor(@PathVariable Long subjectId) {
        return ResponseEntity.ok(subjectService.unassignProfessor(subjectId));
    }

    @PutMapping("/{subjectId}/assign")
    public ResponseEntity<SubjectListDto> assignSubjectToProfessor(@PathVariable Long subjectId,@RequestParam Long professorId){
        return ResponseEntity.ok(subjectService.assignSubjectToProfessor(subjectId,professorId));
    }

}

