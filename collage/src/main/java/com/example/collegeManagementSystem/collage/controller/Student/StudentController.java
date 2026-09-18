package com.example.collegeManagementSystem.collage.controller.Student;


import com.example.collegeManagementSystem.collage.dto.Admission.AdmissionRecordDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentDto;
import com.example.collegeManagementSystem.collage.service.AdmissionRecordService;
import com.example.collegeManagementSystem.collage.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/student")
public class StudentController {

    private final StudentService studentService;
    private final AdmissionRecordService admissionRecordService;

    @PostMapping
    public StudentDto createNewStudent(@RequestBody StudentDto studentDto) {
        return studentService.createNewStudent(studentDto);
    }

    @GetMapping
    public List<StudentDto> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("{StudentId}")
    public StudentDto getStudentById(@PathVariable(name = "StudentId") Long StudentId) {
        return studentService.getStudentById(StudentId);
    }

    @PutMapping("/{studentId}")
    public StudentDto updateStudentById(
            @PathVariable Long studentId,
            @RequestBody StudentDto studentDto) {

        return studentService.updateStudentById(studentDto, studentId);
    }

    @DeleteMapping("/{StudentId}")
    public void deleteStudentById(@PathVariable(name = "StudentId") Long StudentId) {
        studentService.deleteStudentById(StudentId);
    }

    //MAPPED API

    @PostMapping("/{id}/admission-record")
    public AdmissionRecordDto createNewAdmissionRecordByStudentID(@PathVariable Long id, @RequestBody AdmissionRecordDto admissionRecordDto){
        return admissionRecordService.createNewAdmissionRecordByStudentID(id,admissionRecordDto);
    }


}


