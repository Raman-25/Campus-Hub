package com.example.collegeManagementSystem.collage.controller.Admission;

import com.example.collegeManagementSystem.collage.dto.Admission.AdmissionRecordDto;
import com.example.collegeManagementSystem.collage.dto.Admission.NewAdmissionDto;
import com.example.collegeManagementSystem.collage.service.AdmissionRecordService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/new-admission")
public class NewAdmissionController {

    private final AdmissionRecordService admissionRecordService;
    private final ModelMapper modelMapper;

    @PostMapping
    public AdmissionRecordDto createNewAdmission(@RequestBody NewAdmissionDto newAdmissionDto){

        return admissionRecordService.createNewAdmission(newAdmissionDto);

    }

}
