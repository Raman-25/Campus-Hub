package com.example.collegeManagementSystem.collage.service.Professsor;

import com.example.collegeManagementSystem.collage.dto.Professor.ProfessorDto;
import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import com.example.collegeManagementSystem.collage.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService{

    private final ProfessorRepository professorRepository;
    private final ModelMapper modelMapper;
    private final SubjectRepository subjectRepository;

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

}