package com.example.collegeManagementSystem.collage.service.Auth;


import com.example.collegeManagementSystem.collage.dto.Professor.professorRegisterDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentRegisterDto;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final ModelMapper modelMapper;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerStudent(StudentRegisterDto student) {
        StudentEntity studentEntity = new StudentEntity();

        studentEntity.setName(student.getName());
        studentEntity.setEmail(student.getEmail());
        studentEntity.setPassword(passwordEncoder.encode(student.getPassword()));
        studentEntity.setRollNumber(student.getRollNumber());
        studentEntity.setDepartment(student.getDepartment());
        studentEntity.setSemester(student.getSemester());

       studentRepository.save(studentEntity);
    }

    public void registerProfessor(professorRegisterDto professor) {

        ProfessorEntity professorEntity = new ProfessorEntity();

        professorEntity.setTitle(professor.getTitle());
        professorEntity.setEmail(professor.getEmail());
        professorEntity.setPassword(
                passwordEncoder.encode(professor.getPassword())
        );

        professorRepository.save(professorEntity);
    }
}