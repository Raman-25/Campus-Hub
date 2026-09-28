package com.example.collegeManagementSystem.collage.entity.Users;

import com.example.collegeManagementSystem.collage.Enum.Department;
import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
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

public class ProfessorEntity extends BaseUserEntity {

    @Column(length = 100)
    private String name;

    @Column(length = 100, nullable = false)
    private String title;

    @JsonIgnore
    @OneToMany(mappedBy = "professor")
    private List<SubjectEntity> subjects;

    @Enumerated(EnumType.STRING)
    private Department department;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "professor_student",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )                                                                   //this give the owning side to the professor
    private List<StudentEntity> students = new ArrayList<>();


    public String getDisplayName() {
        if (name == null || name.isBlank()) {
            return title;
        } else {
            return title + " " + name;
        }
    }

}
