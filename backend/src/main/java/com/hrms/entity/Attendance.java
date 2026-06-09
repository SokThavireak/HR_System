package com.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "roles"})
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    private LocalDateTime clockInTime;
    private LocalDateTime clockOutTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    private Double hoursWorked;
    private Double overtimeHours;
    private Integer lateMinutes;
    private String clockInNote;
    private String clockOutNote;

    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE
    }
}
