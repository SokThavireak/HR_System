package com.hrms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 6)
    private String employeeId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phone;
    private String department;
    private String position;
    private BigDecimal baseSalary;
    private Double workHoursPerDay;
    private Integer workingDaysPerMonth;
    private java.time.LocalTime workStartTime;
    private LocalDate hireDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // ── Leave Balances ──
    @Builder.Default
    private Integer ilLeaveEntitlement = 18;

    @Builder.Default
    private Integer ilLeaveUsed = 0;

    @Builder.Default
    private Integer sickLeaveEntitlement = 7;

    @Builder.Default
    private Integer sickLeaveUsed = 0;

    @Builder.Default
    private Integer specialLeaveEntitlement = 0;

    @Builder.Default
    private Integer specialLeaveUsed = 0;

    @Builder.Default
    private Boolean unusedIlPaid = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private static final AtomicLong counter = new AtomicLong(0);

    public static void initCounter(long maxValue) {
        counter.set(maxValue);
    }

    public static long getNextId() {
        return counter.incrementAndGet();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (employeeId == null || employeeId.isBlank()) {
            long next = counter.incrementAndGet();
            if (next > 999999) throw new RuntimeException("Employee ID overflow");
            employeeId = String.format("%06d", next);
        }
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
