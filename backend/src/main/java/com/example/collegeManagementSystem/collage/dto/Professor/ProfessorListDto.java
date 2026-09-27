package com.example.collegeManagementSystem.collage.dto.Professor;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfessorListDto {
    private Long id;
    private String name;
    private String email;
}
