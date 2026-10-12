    package com.example.collegeManagementSystem.collage.entity.Attendance;

    import com.example.collegeManagementSystem.collage.entity.SubjectEntity;
    import com.example.collegeManagementSystem.collage.entity.Users.StudentEntity;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    import java.time.LocalDate;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "attendance_entity",
            uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "subject_id", "attendance_date"}))
    public class AttendanceEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "student_id", nullable = false)
        private StudentEntity student;

        @ManyToOne
        @JoinColumn(name = "subject_id", nullable = false)
        private SubjectEntity subject;

        @Column(name = "attendance_date", nullable = false)
        private LocalDate date;

        @Column(nullable = false)
        private boolean present;
    }
