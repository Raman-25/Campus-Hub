package com.example.collegeManagementSystem.collage.dto.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceDto {
    private LocalDate date;
    private Boolean present;
}

