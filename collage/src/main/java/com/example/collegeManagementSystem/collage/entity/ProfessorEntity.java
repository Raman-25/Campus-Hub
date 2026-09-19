package com.example.collegeManagementSystem.collage.entity;

import com.example.collegeManagementSystem.collage.Enum.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = {"subjects","students"})
@NoArgsConstructor
@Table(name = "Professor")

public class ProfessorEntity extends BaseUserEntity {

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
