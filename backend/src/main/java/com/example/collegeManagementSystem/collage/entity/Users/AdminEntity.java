package com.example.collegeManagementSystem.collage.entity.Users;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "admin")
public class AdminEntity extends BaseUserEntity {

    @Column(length = 100, nullable = false)
    private String name;

}