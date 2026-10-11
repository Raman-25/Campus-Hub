package com.example.collegeManagementSystem.collage.entity.Attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceMarkRequest {

    private Long subjectId;
    private LocalDate date;
    private List<AttendanceRecordDto> records;

}
