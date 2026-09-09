package com.example.collegeManagementSystem.collage.service;

import com.example.collegeManagementSystem.collage.dto.StudentDto;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StudentService{

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;


    public StudentDto createNewStudent(StudentDto studentDto) {
        studentDto.setId(null); //not take id as in input
        StudentEntity studentEntity = modelMapper.map(studentDto,StudentEntity.class);
        studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity,StudentDto.class);
    }

    public List<StudentDto> getAllStudents() {
        List<StudentEntity> studentEntityList = studentRepository.findAll();

        return studentEntityList.stream()
                .map(studentEntity -> modelMapper.map(studentEntity, StudentDto.class))
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long StudentId) {
        StudentEntity  studentEntity = studentRepository.findById(StudentId).orElseThrow();
        return modelMapper.map(studentEntity,StudentDto.class);
    }

    public StudentDto updateStudentById(StudentDto studentDto,Long StudentId) {

        StudentEntity studentEntity = modelMapper.map(studentDto,StudentEntity.class);
        studentEntity.setId(StudentId);
        StudentEntity studentEntity1 = studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity1,StudentDto.class);

    }

    public void deleteStudentById(Long StudentId) {
        StudentEntity  studentEntity = studentRepository.findById(StudentId).orElseThrow();
        studentRepository.deleteById(StudentId);
    }
}
