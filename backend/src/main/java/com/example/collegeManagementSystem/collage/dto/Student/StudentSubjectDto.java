package com.example.collegeManagementSystem.collage.dto.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSubjectDto {
    private Long id;
    private String title;
    private String professorName;
    private Integer attendance;
    private String grade;
}

