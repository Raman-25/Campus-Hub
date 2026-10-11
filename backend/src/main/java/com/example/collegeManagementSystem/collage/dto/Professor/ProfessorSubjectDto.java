package com.example.collegeManagementSystem.collage.dto.Professor;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorSubjectDto {
    private Long id;
    private String title;
    private Integer year;
    private Long studentCount;
    private LocalDate lastMarkedDate;
}
