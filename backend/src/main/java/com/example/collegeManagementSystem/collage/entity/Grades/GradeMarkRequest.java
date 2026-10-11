package com.example.collegeManagementSystem.collage.entity.Grades;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
    public class GradeMarkRequest {
        private Long subjectId;
        private List<GradeRecordDto> grades;
    }

