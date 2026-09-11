package com.example.collegeManagementSystem.collage.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = {"subjects","students"})
@NoArgsConstructor
@Table(name = "Professor")

public class ProfessorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String title;

    @JsonIgnore
    @OneToMany(mappedBy = "professor")
    private List<SubjectEntity> subjects;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "professor_student",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )                                                                   //this give the owning side to the professor
    private List<StudentEntity> students = new ArrayList<>();
}
