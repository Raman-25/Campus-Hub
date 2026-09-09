package com.example.collegeManagementSystem.collage.controller;


import com.example.collegeManagementSystem.collage.dto.StudentDto;
import com.example.collegeManagementSystem.collage.dto.SubjectDto;
import com.example.collegeManagementSystem.collage.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/subject")
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public SubjectDto createNewSubject(@RequestBody SubjectDto subjectDto) {
        return subjectService.createNewSubject(subjectDto);
    }

    @GetMapping
    public List<SubjectDto> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("{SubjectId}")
    public SubjectDto getSubjectById(@PathVariable(name = "SubjectId") Long SubjectId) {
        return subjectService.getSubjectById(SubjectId);
    }

    @PutMapping("/{SubjectId}")
    public SubjectDto updateSubjectById(
            @PathVariable Long SubjectId,
            @RequestBody SubjectDto subjectDto) {

        return subjectService.updateSubjectById(subjectDto, SubjectId);
    }

    @DeleteMapping("/{SubjectId}")
    public void deleteSubjectById(@PathVariable(name = "SubjectId") Long SubjectId) {
        subjectService.deleteSubjectById(SubjectId);
    }

}

