package com.example.collegeManagementSystem.collage.service;

import com.example.collegeManagementSystem.collage.dto.ProfessorDto;
import com.example.collegeManagementSystem.collage.entity.ProfessorEntity;
import com.example.collegeManagementSystem.collage.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ModelMapper modelMapper;

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
}