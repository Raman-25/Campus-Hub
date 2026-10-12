package com.example.collegeManagementSystem.collage.dto.Attendace;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecordDto {
    private Long studentId;
    private boolean present;
}
