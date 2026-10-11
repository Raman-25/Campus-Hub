package com.example.collegeManagementSystem.collage.dto.Professor;

import com.example.collegeManagementSystem.collage.Enum.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfessorStudentDto {

    private Long studentId;
    private String name;
    private String rollNumber;
    private Integer attendance;
    private Grade grades;
}
