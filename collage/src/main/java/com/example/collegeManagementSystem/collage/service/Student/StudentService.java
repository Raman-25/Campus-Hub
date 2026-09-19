package com.example.collegeManagementSystem.collage.service.Student;

import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import com.example.collegeManagementSystem.collage.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;



import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;
    private final ProfessorRepository professorRepository;
    private final SubjectRepository subjectRepository;


    public StudentDto createNewStudent(StudentDto studentDto) {
        studentDto.setId(null); //not take id as in input
        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);
        studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity, StudentDto.class);
    }

    public List<StudentDto> getAllStudents() {
        List<StudentEntity> studentEntityList = studentRepository.findAll();

        return studentEntityList.stream()
                .map(studentEntity -> modelMapper.map(studentEntity, StudentDto.class))
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long StudentId) {
        StudentEntity studentEntity = studentRepository.findById(StudentId).orElseThrow();
        return modelMapper.map(studentEntity, StudentDto.class);
    }

    public StudentDto updateStudentById(StudentDto studentDto, Long StudentId) {

        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);
        studentEntity.setId(StudentId);
        StudentEntity studentEntity1 = studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity1, StudentDto.class);

    }

    public void deleteStudentById(Long StudentId) {
        StudentEntity studentEntity = studentRepository.findById(StudentId).orElseThrow();
        studentRepository.deleteById(StudentId);
    }

    //Mapping Apis

    //PROFESSOR-STUDENT(MANY TO MANY)

    public void assignProfessorToaStudent(Long studentId, Long professorId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();
        ProfessorEntity professorEntity = professorRepository.findById(professorId).orElseThrow();

        professorEntity.getStudents().add(studentEntity);  //since professor is the owning side so we add student here
        professorRepository.save(professorEntity);
    }

    public List<StudentEntity> getAllStudentsOfProfessors(Long professorId) {

        ProfessorEntity professorEntity = professorRepository.findById(professorId).orElseThrow();
        return professorEntity.getStudents();
    }

    public List<ProfessorDto> getAllProfessorOfAStudent(Long studentId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();

        return studentEntity.getProfessors().stream()
                .map(professorEntity ->
                        modelMapper.map(professorEntity, ProfessorDto.class))
                .collect(Collectors.toList());

    }

    public void deleteProfessorFromAStudent(Long studentId, Long professorId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();

        ProfessorEntity professorEntity = professorRepository.findById(professorId).orElseThrow();

        professorEntity.getStudents().remove(studentEntity);
        professorRepository.save(professorEntity);
    }

    //STUDENT-SUBJECT (MANY TO MANY)

    public void assignStudentASubject(Long studentId, Long subjectId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();
        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow();

        studentEntity.getSubjects().add(subjectEntity);  //since student is the owning side so we add subject here
        studentRepository.save(studentEntity);
    }

    public List<SubjectDto> getAllSubjectsOfAStudent(Long studentId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();
        return studentEntity.getSubjects().stream()
                .map(subjectEntity ->
                        modelMapper.map(subjectEntity, SubjectDto.class))
                .collect(Collectors.toList());
    }

    public void deleteSubjectFromAStudent(Long studentId, Long subjectId) {

        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();

        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow();

        studentEntity.getSubjects().remove(subjectEntity);
        studentRepository.save(studentEntity);
    }

}
