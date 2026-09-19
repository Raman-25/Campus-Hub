package com.example.collegeManagementSystem.collage.dto.Admin;


import com.example.collegeManagementSystem.collage.Enum.Role;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class adminRegisterDto {

    private String name;

    private String email;

    private String password;

    private String department;

    private Integer level = 1; // 1 = regular admin, 2 = super admin, etc.
}
