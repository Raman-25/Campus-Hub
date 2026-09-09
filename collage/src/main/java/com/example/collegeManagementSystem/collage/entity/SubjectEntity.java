package com.example.collegeManagementSystem.collage.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = {"professor", "students"})
@NoArgsConstructor
@Table(name = "Subject")
public class SubjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private ProfessorEntity professor;

    @ManyToMany(mappedBy = "subjects")
    private List<StudentEntity> students;  //mapped by give the inverse side
}
