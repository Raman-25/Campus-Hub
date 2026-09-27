package com.example.collegeManagementSystem.collage.dto.Student;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentListDto {
    private Long id;
    private String name;
    private String rollNumber;
}

