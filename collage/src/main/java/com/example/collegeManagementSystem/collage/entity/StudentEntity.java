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
public class StudentEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    private String email;
    private String password;
    private String rollNumber;
    private String department;
    private Integer semester;

    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;

    @ManyToMany(mappedBy = "students") //inverse side
    private List<ProfessorEntity> professors = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "student_subject",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<SubjectEntity> subjects;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }
}
