package com.example.collegeManagementSystem.collage.controller;

import com.example.collegeManagementSystem.collage.dto.AdmissionRecordDto;
import com.example.collegeManagementSystem.collage.service.AdmissionRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admission-record")
public class AdmissionRecordController {

    private final AdmissionRecordService admissionRecordService;


    @GetMapping
    public List<AdmissionRecordDto> getAllAdmissionRecords() {
        return admissionRecordService.getAllAdmissionRecords();
    }

    @GetMapping("/{admissionRecordId}")
    public AdmissionRecordDto getAdmissionRecordById(
            @PathVariable Long admissionRecordId) {
        return admissionRecordService.getAdmissionRecordById(admissionRecordId);
    }

    @PutMapping("/{admissionRecordId}")
    public AdmissionRecordDto updateAdmissionRecord(
            @PathVariable Long admissionRecordId,
            @RequestBody AdmissionRecordDto admissionRecordDto) {
        return admissionRecordService.updateAdmissionRecord(
                admissionRecordId, admissionRecordDto);
    }

    @DeleteMapping("/{admissionRecordId}")
    public void deleteAdmissionRecord(
            @PathVariable Long admissionRecordId) {
        admissionRecordService.deleteAdmissionRecord(admissionRecordId);
    }
}