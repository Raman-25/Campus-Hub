package com.example.collegeManagementSystem.collage.dto.Subject;

import com.example.collegeManagementSystem.collage.Enum.Department;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectListDto {
    private Long id;
    private String title;
    private String professorName;
}
