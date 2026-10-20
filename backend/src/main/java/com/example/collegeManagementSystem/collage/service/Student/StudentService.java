package com.example.collegeManagementSystem.collage.service.Student;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.dto.Student.StudentAttendanceDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentListDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentProfileDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentSubjectDto;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final GradeRepository gradeRepository;
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

        if (!subject.getDepartment().equals(student.getDepartment())   //check if the subject belong to student or not
                || !subject.getYear().equals(student.getYear())) {
            throw new ResourceNotFoundException("Subject not found");
        }

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
    public void deleteStudentById(Long studentId) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        attendanceRepository.deleteAttendancesByStudent(student);
        gradeRepository.deleteGradesByStudent(student);
        studentRepository.delete(student);
    }

    private Long getLoggedInStudentId() {
        return ((StudentEntity) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getId();
    }

    // ADMIN ROUTES

    public List<StudentListDto> getByDepartmentAndYear(Department department, Integer year) {

        return studentRepository.findByDepartmentAndYear(department, year)
                .stream()
                .map(s -> new StudentListDto(s.getId(), s.getName(), s.getRollNumber()))
                .toList();

    }
}
