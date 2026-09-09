package com.example.collegeManagementSystem.collage.service;

import com.example.collegeManagementSystem.collage.dto.AdmissionRecordDto;
import com.example.collegeManagementSystem.collage.entity.AdmissionRecordEntity;
import com.example.collegeManagementSystem.collage.repository.AdmissionRecordRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmissionRecordService {

    private final AdmissionRecordRepository admissionRecordRepository;
    private final ModelMapper modelMapper;

    public AdmissionRecordDto createAdmissionRecord(AdmissionRecordDto admissionRecordDto) {

        AdmissionRecordEntity admissionRecordEntity =
                modelMapper.map(admissionRecordDto, AdmissionRecordEntity.class);

        AdmissionRecordEntity savedAdmissionRecord =
                admissionRecordRepository.save(admissionRecordEntity);

        return modelMapper.map(savedAdmissionRecord, AdmissionRecordDto.class);
    }

    public List<AdmissionRecordDto> getAllAdmissionRecords() {

        List<AdmissionRecordEntity> admissionRecordEntityList =
                admissionRecordRepository.findAll();

        return admissionRecordEntityList.stream()
                .map(admissionRecordEntity ->
                        modelMapper.map(admissionRecordEntity, AdmissionRecordDto.class))
                .collect(Collectors.toList());
    }

    public AdmissionRecordDto getAdmissionRecordById(Long id) {

        AdmissionRecordEntity admissionRecordEntity =
                admissionRecordRepository.findById(id).orElseThrow();

        return modelMapper.map(admissionRecordEntity, AdmissionRecordDto.class);
    }

    public AdmissionRecordDto updateAdmissionRecord(
            Long id, AdmissionRecordDto admissionRecordDto) {

        AdmissionRecordEntity admissionRecordEntity =
                modelMapper.map(admissionRecordDto, AdmissionRecordEntity.class);

        admissionRecordEntity.setId(id);

        AdmissionRecordEntity savedAdmissionRecord =
                admissionRecordRepository.save(admissionRecordEntity);

        return modelMapper.map(savedAdmissionRecord, AdmissionRecordDto.class);
    }

    public void deleteAdmissionRecord(Long id) {

        admissionRecordRepository.deleteById(id);
    }
}