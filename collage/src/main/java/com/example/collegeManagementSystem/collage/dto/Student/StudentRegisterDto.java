package com.example.collegeManagementSystem.collage.dto.Student;

import lombok.Data;

@Data
public class StudentRegisterDto {

    private String name;
    private String email;
    private String password;
    private String rollNumber;
    private String department;
    private Integer semester;


}
