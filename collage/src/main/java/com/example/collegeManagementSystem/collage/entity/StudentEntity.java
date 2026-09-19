package com.example.collegeManagementSystem.collage.entity;


import com.example.collegeManagementSystem.collage.Enum.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = {"professors", "subjects"})
@NoArgsConstructor
@Table(name = "student")
public class StudentEntity extends BaseUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    private String rollNumber;

    private String department;

    private Integer semester;

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

