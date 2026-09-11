package com.example.collegeManagementSystem.collage.service;

import com.example.collegeManagementSystem.collage.dto.AdmissionRecordDto;
import com.example.collegeManagementSystem.collage.dto.NewAdmissionDto;
import com.example.collegeManagementSystem.collage.entity.AdmissionRecordEntity;
import com.example.collegeManagementSystem.collage.entity.StudentEntity;
import com.example.collegeManagementSystem.collage.repository.AdmissionRecordRepository;
import com.example.collegeManagementSystem.collage.repository.StudentRepository;
import jakarta.transaction.Transactional;
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
    private final StudentRepository studentRepository;

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

        AdmissionRecordEntity admissionRecordEntity1 =
                modelMapper.map(admissionRecordDto, AdmissionRecordEntity.class);

        AdmissionRecordEntity savedAdmissionRecord =
                admissionRecordRepository.save(admissionRecordEntity1);

        return modelMapper.map(savedAdmissionRecord, AdmissionRecordDto.class);
    }

    public void deleteAdmissionRecord(Long id) {

        admissionRecordRepository.deleteById(id);
    }

    //Mapping API

    public AdmissionRecordDto createNewAdmissionRecordByStudentID(Long id, AdmissionRecordDto admissionRecordDto) {

     StudentEntity student =  studentRepository.findById(id).orElseThrow(); //will return name
     AdmissionRecordEntity admissionRecordEntity = modelMapper.map(admissionRecordDto,AdmissionRecordEntity.class); //change the dto to entity
     admissionRecordEntity.setStudent(student); //set student name in dto(fees)

        AdmissionRecordEntity saved =
                admissionRecordRepository.save(admissionRecordEntity);

        return modelMapper.map(saved, AdmissionRecordDto.class);
    }


    @Transactional
    public AdmissionRecordDto createNewAdmission(NewAdmissionDto newAdmissionDto) {

        StudentEntity studentEntity = new StudentEntity();
        studentEntity.setName(newAdmissionDto.getName());
        StudentEntity savedStudent = studentRepository.save(studentEntity);

        AdmissionRecordEntity admissionRecordEntity =
                modelMapper.map(newAdmissionDto, AdmissionRecordEntity.class);

        admissionRecordEntity.setStudent(savedStudent); //to connect the student and the admission record

        AdmissionRecordEntity savedAdmissionRecord =
                admissionRecordRepository.save(admissionRecordEntity);

        return modelMapper.map(savedAdmissionRecord, AdmissionRecordDto.class);

    }
}