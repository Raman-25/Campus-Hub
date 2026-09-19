package com.example.collegeManagementSystem.collage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "admin")
public class AdminEntity extends BaseUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 255)
    private String department;

    @Column(nullable = false)
    private Integer level = 1; // 1 = regular admin, 2 = super admin, etc.


}