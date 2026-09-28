package com.example.collegeManagementSystem.collage.service;


import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.advice.exceptions.ResourceNotFoundException;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectListDto;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.entity.Users.ProfessorEntity;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.SubjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final ProfessorRepository professorRepository;
    private final ModelMapper modelMapper;


    public SubjectDto createNewSubject(SubjectDto subjectDto) {
        SubjectEntity subjectEntity = modelMapper.map(subjectDto, SubjectEntity.class);
        subjectRepository.save(subjectEntity);
        return modelMapper.map(subjectEntity, SubjectDto.class);
    }

    public SubjectDto getSubjectById(Long subjectId) {
        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow();
        return modelMapper.map(subjectEntity, SubjectDto.class);
    }

    public SubjectDto updateSubjectById(SubjectDto subjectDto, Long subjectId) {
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject with id " + subjectId + " Not Found"));
        subject.setTitle(subjectDto.getTitle());
        subject.setDepartment(subjectDto.getDepartment());
        subject.setYear(subjectDto.getYear());
        SubjectEntity saved = subjectRepository.save(subject);
        return modelMapper.map(saved, SubjectDto.class);
    }



    public List<SubjectListDto> getSubjectsByDepartmentAndYear(Department department, Integer year) {

        return subjectRepository.findByDepartmentAndYear(department, year)
                .stream()
                .map(s -> {
                    String professorName;
                    if (s.getProfessor() != null) {
                        professorName = s.getProfessor().getTitle();
                    } else {
                        professorName = "Unassigned";
                    }
                    return new SubjectListDto(s.getId(), s.getTitle(), professorName);
                })
                .toList();


    }


    @Transactional
    public SubjectListDto assignSubjectToProfessor(Long subjectId, Long professorId) {

        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject with id" + subjectId + "Not Found"));

        ProfessorEntity professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor with id" + professorId + "Not Found"));

        if (professor.getDepartment().equals(subject.getDepartment())) {
            subject.setProfessor(professor);
            subjectRepository.save(subject);
        } else {
            throw new IllegalArgumentException("Professor and subject must belong to the same department");
        }

        String professorName;
        if (subject.getProfessor() != null) {
            professorName = subject.getProfessor().getTitle();
        } else {
            professorName = "Unassigned";
        }
        return new SubjectListDto(subject.getId(), subject.getTitle(), professorName);

    }
    @Transactional
    public SubjectListDto unassignProfessor(Long subjectId) {
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject with id " + subjectId + " Not Found"));
        subject.setProfessor(null);
        SubjectEntity saved = subjectRepository.save(subject);
        return new SubjectListDto(saved.getId(), saved.getTitle(), "Unassigned");
    }

    @Transactional
    public void deleteSubjectById(Long subjectId) {
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject with id " + subjectId + " Not Found"));
        subjectRepository.delete(subject);
    }
}
