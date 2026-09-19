package com.example.collegeManagementSystem.collage.controller.Professor;

import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.service.Professsor.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/professor")
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    public ProfessorDto createNewProfessor(
            @RequestBody ProfessorDto professorDto) {

        return professorService.createNewProfessor(professorDto);
    }

    @GetMapping
    public List<ProfessorDto> getAllProfessors() {

        return professorService.getAllProfessors();
    }

    @GetMapping("/{id}")
    public ProfessorDto getProfessorById(
            @PathVariable Long id) {

        return professorService.getProfessorById(id);
    }

    @PutMapping("/{id}")
    public ProfessorDto updateProfessorById(
            @PathVariable Long id,
            @RequestBody ProfessorDto professorDto) {

        return professorService.updateProfessorById(professorDto, id);
    }

    @DeleteMapping("/{id}")
    public void deleteProfessorById(@PathVariable Long id) {

        professorService.deleteProfessorById(id);
    }
}