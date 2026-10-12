package com.example.collegeManagementSystem.collage.service.Professsor;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.Enum.Grade;
import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.dto.Attendace.DailyAttendanceDto;
import com.example.collegeManagementSystem.collage.dto.Professor.*;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceEntity;
import com.example.collegeManagementSystem.collage.entity.Attendance.AttendanceMarkRequest;
import com.example.collegeManagementSystem.collage.dto.Attendace.AttendanceRecordDto;
import com.example.collegeManagementSystem.collage.entity.GradeEntity;
import com.example.collegeManagementSystem.collage.entity.Grades.GradeMarkRequest;
import com.example.collegeManagementSystem.collage.entity.Grades.GradeRecordDto;
import com.example.collegeManagementSystem.collage.entity.Users.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfessorService{

    private final ProfessorRepository professorRepository;
    private final ModelMapper modelMapper;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;


    public ProfessorDto createNewProfessor(ProfessorDto professorDto) {

        professorDto.setId(null);
        ProfessorEntity professorEntity =
                modelMapper.map(professorDto, ProfessorEntity.class);

        ProfessorEntity savedProfessor =
                professorRepository.save(professorEntity);

        return modelMapper.map(savedProfessor, ProfessorDto.class);
    }

    public List<ProfessorDto> getAllProfessors() {

        List<ProfessorEntity> professorEntityList =
                professorRepository.findAll();

        return professorEntityList.stream()
                .map(professorEntity ->
                        modelMapper.map(professorEntity, ProfessorDto.class))
                .collect(Collectors.toList());
    }

    public ProfessorDto getProfessorById(Long id) {

        ProfessorEntity professorEntity =
                professorRepository.findById(id).orElseThrow();

        return modelMapper.map(professorEntity, ProfessorDto.class);
    }

    public ProfessorDto updateProfessorById(
            ProfessorDto professorDto, Long id) {

        ProfessorEntity professorEntity =
                modelMapper.map(professorDto, ProfessorEntity.class);

        professorEntity.setId(id);

        ProfessorEntity savedProfessor =
                professorRepository.save(professorEntity);

        return modelMapper.map(savedProfessor, ProfessorDto.class);
    }

    public void deleteProfessorById(Long id) {

        professorRepository.deleteById(id);
    }

    // MAPPING APIS

    //PROFESSOR-SUBJECT(ONE TO MANY)

    public void assignSubject(Long professorId, Long subjectId) {

     ProfessorEntity professorEntity = professorRepository.findById(professorId)
             .orElseThrow();

     SubjectEntity subjectEntity = subjectRepository.findById(subjectId)
             .orElseThrow();

    subjectEntity.setProfessor(professorEntity); //Because the subject is the owing side
    subjectRepository.save(subjectEntity);
    }

    public List<SubjectDto> getProfessorAllSubjects(Long professorId) {

        ProfessorEntity professorEntity = professorRepository.findById(professorId).orElseThrow();

        return professorEntity.getSubjects().stream()
                .map(subjectEntity ->
                        modelMapper.map(subjectEntity, SubjectDto.class))
                .collect(Collectors.toList());
    }

    public void deleteASubjectFromProfessor(Long professorId, Long subjectId) {
        ProfessorEntity professorEntity = professorRepository.findById(professorId)
                .orElseThrow();

        SubjectEntity subjectEntity = subjectRepository.findById(subjectId)
                .orElseThrow();

        if(subjectEntity.getProfessor().getId().equals(professorId)){
            subjectEntity.setProfessor(null);
            subjectRepository.save(subjectEntity);

        }
    }
    public ProfessorDto getSubjectProfessor(Long subjectId) {

        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow();

        return modelMapper.map(subjectEntity.getProfessor(),ProfessorDto.class);
    }

    // ADMIN ROUTES

    public List<ProfessorListDto> getByDepartment(Department department) {

        return professorRepository.findByDepartment(department)
                .stream()
                .map(p -> new ProfessorListDto(p.getId(),p.getName(), p.getTitle(), p.getEmail()))
                .toList();

    }
    @Transactional
    public void deleteProfessor(Long id) {

        ProfessorEntity professorEntity = professorRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Professor not found with id: " + id));

        // Must null the subjects first: subject.professor_id is a FK pointer.
        professorEntity.getSubjects().forEach(subjectEntity -> subjectEntity.setProfessor(null));

        professorRepository.deleteById(id);

    }

    //Professor-Routes

    public List<ProfessorStudentDto> getStudentsBySubject(Long subjectId) {

        Long professorId = getLoggedInProfessorId();
        SubjectEntity subject = getOwnedSubject(subjectId,professorId);

        List<StudentEntity> studentEntity = studentRepository.findByDepartmentAndYear(subject.getDepartment(),subject.getYear());

        return studentEntity.stream()
                .map(s-> {
                    Grade grade = gradeRepository.findByStudentAndSubject(s,subject)
                            .map(GradeEntity::getGrade)
                            .orElse(null);


                    long total = attendanceRepository.countByStudentAndSubject(s,subject);
                    Integer attendance = null;
                    if(total>0){
                        long presentDays = attendanceRepository.countByStudentAndSubjectAndPresentTrue(s, subject);
                        attendance = (int) Math.round(presentDays * 100.0 / total);
                    }

                  return new ProfessorStudentDto(
                            s.getId(),
                            s.getName(),
                            s.getRollNumber(),
                            attendance,
                            grade);
                })
                .toList();
    }

    public void markAttendanceByDate(AttendanceMarkRequest request) {

        Long professorId = getLoggedInProfessorId();
        SubjectEntity subject = getOwnedSubject(request.getSubjectId(), professorId);

        if (request.getDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot mark attendance for a future date");
        }

            for (AttendanceRecordDto record : request.getRecords()) {
            StudentEntity student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            AttendanceEntity attendance = attendanceRepository.findByStudentAndSubjectAndDate(student, subject,request.getDate()).
                    orElseGet(()->{
                        AttendanceEntity a = new AttendanceEntity();
                        a.setDate(request.getDate());
                        a.setSubject(subject);
                        a.setStudent(student);
                        return a;
                    });

            attendance.setPresent(record.isPresent());
            attendanceRepository.save(attendance);

        }
    }

    public void setGrade(GradeMarkRequest request) {

        Long professorId = getLoggedInProfessorId();
        SubjectEntity subject = getOwnedSubject(request.getSubjectId(), professorId);

        for (GradeRecordDto record : request.getGrades()) {
            StudentEntity student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            GradeEntity grade = gradeRepository.findByStudentAndSubject(student,subject)
                    .orElseGet(()->{
                        GradeEntity g = new GradeEntity();
                        g.setSubject(subject);
                        g.setStudent(student);
                        return g;
                    });

            grade.setGrade(record.getGrade());
            gradeRepository.save(grade);
        }
    }


    public List<ProfessorSubjectDto> getMySubjects() {
        Long professorId = getLoggedInProfessorId();
        return subjectRepository.findByProfessorId(professorId).stream()
                .map(s-> {
                    long studentCount = studentRepository.countByDepartmentAndYear(s.getDepartment(), s.getYear());
                    LocalDate lastMarked = attendanceRepository.findTopBySubjectOrderByDateDesc(s)
                            .map(AttendanceEntity::getDate)
                            .orElse(null);
                    return new ProfessorSubjectDto(s.getId(), s.getTitle(), s.getYear(), studentCount, lastMarked);
                })
                .toList();
    }

    public ProfessorGreetingDto getMyGreeting() {
        Long professorId = getLoggedInProfessorId();
        ProfessorEntity p = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));

        String displayName = p.getName();
        if (p.getTitle() != null) {
            displayName = p.getTitle() + " " + p.getName();
        }
        return new ProfessorGreetingDto(displayName);
    }


    public List<DailyAttendanceDto> getAttendanceByDate(Long subjectId, LocalDate date) {
        Long professorId = getLoggedInProfessorId();
        SubjectEntity subject = getOwnedSubject(subjectId, professorId);

        return studentRepository.findByDepartmentAndYear(subject.getDepartment(), subject.getYear())
                .stream()
                .map(s -> {
                    Boolean present = attendanceRepository.findByStudentAndSubjectAndDate(s, subject, date)
                            .map(AttendanceEntity::isPresent)
                            .orElse(null);
                    return new DailyAttendanceDto(s.getName(), s.getRollNumber(), present);
                })
                .toList();
    }


    //CHECK IF THE PROFESSOR IS ASSIGNED TO THAT SUBJECT OR NOT
    private SubjectEntity getOwnedSubject(Long subjectId, Long professorId) {
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        if (subject.getProfessor() == null || !subject.getProfessor().getId().equals(professorId)) {
            throw new AccessDeniedException("You are not assigned to this subject");
        }
        return subject;
    }
    private Long getLoggedInProfessorId() {
        return ((ProfessorEntity) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getId();
    }


}