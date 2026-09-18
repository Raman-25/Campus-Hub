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

public class ProfessorEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String title;

    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.PROFESSOR;

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
