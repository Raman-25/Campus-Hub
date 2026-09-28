package com.example.collegeManagementSystem.collage.dto.Admin;


import com.example.collegeManagementSystem.collage.Enum.Department;
import lombok.Data;

@Data
public class adminRegisterDto {

    private String name;

    private String email;

    private String password;

    private Department department;

}
