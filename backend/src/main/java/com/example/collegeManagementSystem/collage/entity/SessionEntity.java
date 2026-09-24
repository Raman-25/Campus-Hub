package com.example.collegeManagementSystem.collage.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 512)
    String refreshToken;

    @Column(nullable = false)
    Long userId;

    @Column(nullable = false)
    String role; // STUDENT, PROFESSOR, ADMIN

    LocalDateTime createdAt;
    LocalDateTime lastUsedAt;
    LocalDateTime expiresAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUsedAt = LocalDateTime.now();
    }
}
