package com.example.collegeManagementSystem.collage.entity.Users;


import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = {"professors", "subjects"})
@NoArgsConstructor
@Table(name = "student")
public class StudentEntity extends BaseUserEntity {


    @Column(length = 100, nullable = false)
    private String name;

    private String rollNumber;

    @Enumerated(EnumType.STRING)
    private Department department;

    private Integer year;

    @ManyToMany(mappedBy = "students") //inverse side
    private List<ProfessorEntity> professors = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "student_subject",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<SubjectEntity> subjects;
}

