package com.example.collegeManagementSystem.collage.entity;


import com.example.collegeManagementSystem.collage.Enum.Grade;
import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "subject_id"}))
public class GradeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

}
