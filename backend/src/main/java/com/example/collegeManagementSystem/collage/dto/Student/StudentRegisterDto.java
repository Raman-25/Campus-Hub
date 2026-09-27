package com.example.collegeManagementSystem.collage.dto.Student;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class StudentRegisterDto {

    private String name;
    private String email;
    private String password;
    private String rollNumber;
    private Department department;
    @JsonAlias("semester")
    private Integer year;


}
