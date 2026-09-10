package com.example.collegeManagementSystem.collage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "AdmissionRecord")
public class AdmissionRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer fees;

    @OneToOne(cascade = CascadeType.ALL) //we put cascade at admission record so it work adm_recd-->student
    @JoinColumn(name = "student_id", unique = true)
    private StudentEntity student;

}
