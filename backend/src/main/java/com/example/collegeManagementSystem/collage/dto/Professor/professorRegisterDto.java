package com.example.collegeManagementSystem.collage.dto.Professor;


import com.example.collegeManagementSystem.collage.Enum.Department;
import lombok.Data;

@Data
public class professorRegisterDto {

    private String name;
    private String title;
    private String email;
    private String password;
    private Department department;
}
