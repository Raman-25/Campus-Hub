package com.example.collegeManagementSystem.collage.entity.Grades;

import com.example.collegeManagementSystem.collage.Enum.Grade;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GradeRecordDto {
    private Long studentId;
    private Grade grade;
}
