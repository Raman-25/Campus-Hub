package com.example.collegeManagementSystem.collage.dto.Student;

import com.example.collegeManagementSystem.collage.Enum.Department;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {
    private String name;
    private String rollNumber;
    private Department department;
    private Integer year;
}

