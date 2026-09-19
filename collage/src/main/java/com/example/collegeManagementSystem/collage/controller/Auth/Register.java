package com.example.collegeManagementSystem.collage.controller.Auth;


import com.example.collegeManagementSystem.collage.dto.Admin.adminRegisterDto;
import com.example.collegeManagementSystem.collage.dto.Professor.professorRegisterDto;
import com.example.collegeManagementSystem.collage.dto.Student.StudentRegisterDto;
import com.example.collegeManagementSystem.collage.service.Auth.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth/register")
public class Register {

    private final RegistrationService registrationService;

    @PostMapping("/student")
    public ResponseEntity<String> registerStudent(@RequestBody StudentRegisterDto student){
        registrationService.registerStudent(student);

        return ResponseEntity.ok("Student Register Successfully");
    }

    @PostMapping("/professor")
    public ResponseEntity<String> registerProfessor(@RequestBody professorRegisterDto professor){
        registrationService.registerProfessor(professor);

        return ResponseEntity.ok("Professor Register Successfully");
    }

    @PostMapping("/admin")
    public ResponseEntity<String> registerAdmins(@RequestBody adminRegisterDto admin){
        registrationService.registerAdmins(admin);

        return ResponseEntity.ok("Admin Register Successfully");
    }



}
