package com.example.collegeManagementSystem.collage.service.Student;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentAttendanceDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentListDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentProfileDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentSubjectDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.entity.GradeEntity;
import com.example.collegeManagementSystem.collage.entity.Users.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;
    private final AttendanceRepository attendanceRepository;
    private final GradeRepository gradeRepository;
    private final ProfessorRepository professorRepository;
    private final SubjectRepository subjectRepository;

    public StudentProfileDto getMyProfile() {
        StudentEntity s = studentRepository.findById(getLoggedInStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not Found"));

        return new StudentProfileDto(s.getName(), s.getRollNumber(), s.getDepartment(), s.getYear());
    }

    public List<StudentSubjectDto> getMySubjects() {
        Long studentId = getLoggedInStudentId();
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return subjectRepository.findByDepartmentAndYear(student.getDepartment(), student.getYear())
                .stream()
                .map(subject -> {
                    long total = attendanceRepository.countByStudentAndSubject(student, subject);
                    long presentCount = attendanceRepository.countByStudentAndSubjectAndPresentTrue(student, subject);

                    Integer attendance = null;
                    if (total > 0) {
                        attendance = (int) (presentCount * 100 / total);
                    }
                    String grade = gradeRepository.findByStudentAndSubject(student, subject)
                            .map(g -> g.getGrade().toString())
                            .orElse(null);

                    String professorName = "Unassigned";
                    if (subject.getProfessor() != null) {
                        professorName = subject.getProfessor().getDisplayName();
                    }

                    return new StudentSubjectDto(
                            subject.getId(),
                            subject.getTitle(),
                            professorName,
                            attendance,
                            grade);
                })
                .toList();
    }

    public List<StudentAttendanceDto> getMyAttendanceHistory(Long subjectId, LocalDate date) {
        Long studentId = getLoggedInStudentId();
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (date != null) {
            return attendanceRepository.findByStudentAndSubjectAndDate(student, subject, date)
                    .map(a -> List.of(new StudentAttendanceDto(a.getDate(), a.isPresent())))
                    .orElse(List.of());
        }

        return attendanceRepository.findByStudentAndSubjectOrderByDateDesc(student, subject)
                .stream()
                .limit(3)
                .map(a -> new StudentAttendanceDto(a.getDate(), a.isPresent()))
                .toList();
    }

    @Transactional
    public void deleteStudentById(Long StudentId) {
        StudentEntity studentEntity = studentRepository.findById(StudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + StudentId));
        studentRepository.deleteById(StudentId);
    }

    private Long getLoggedInStudentId() {
        return ((StudentEntity) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getId();
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

    // ADMIN ROUTES

    public List<StudentListDto> getByDepartmentAndYear(Department department, Integer year) {

        return studentRepository.findByDepartmentAndYear(department, year)
                .stream()
                .map(s -> new StudentListDto(s.getId(), s.getName(), s.getRollNumber()))
                .toList();

    }
}
