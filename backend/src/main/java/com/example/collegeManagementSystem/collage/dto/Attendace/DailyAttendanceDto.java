package com.example.collegeManagementSystem.collage.dto.Attendace;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyAttendanceDto {
    private String name;
    private String rollNumber;
    private Boolean present;
}
