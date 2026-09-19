package com.example.collegeManagementSystem.collage.service;


import com.example.collegeManagementSystem.collage.dto.Subject.SubjectDto;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import com.example.collegeManagementSystem.collage.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService{

    private final SubjectRepository subjectRepository;
    private final ModelMapper modelMapper;


    public SubjectDto createNewSubject(SubjectDto subjectDto) {
        subjectDto.setId(null); //not take id as in input
        SubjectEntity subjectEntity = modelMapper.map(subjectDto,SubjectEntity.class);
        subjectRepository.save(subjectEntity);
        return modelMapper.map(subjectEntity, SubjectDto.class);
    }

    public List<SubjectDto>getAllSubjects() {

        List<SubjectEntity>subjectEntityList = subjectRepository.findAll();

        return subjectEntityList.stream()
                .map(subjectEntity -> modelMapper.map(subjectEntity,SubjectDto.class))
                .collect(Collectors.toList());
    }

    public SubjectDto getSubjectById(Long subjectId) {
        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow();
        return modelMapper.map(subjectEntity,SubjectDto.class);
    }

    public SubjectDto updateSubjectById(SubjectDto subjectDto, Long subjectId) {
        SubjectEntity subjectEntity = modelMapper.map(subjectDto,SubjectEntity.class);
        subjectEntity.setId(subjectId);
        SubjectEntity subjectEntity1 = subjectRepository.save(subjectEntity);
        return modelMapper.map(subjectEntity1,SubjectDto.class);

    }

    public void deleteSubjectById(Long subjectId) {
        SubjectEntity  subjectEntity = subjectRepository.findById(subjectId).orElseThrow();
        subjectRepository.deleteById(subjectId);
    }
}
