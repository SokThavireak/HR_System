package com.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payroll {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "roles"})
    private User user;

    @Column(nullable = false)
    private LocalDate payPeriodStart;

    @Column(nullable = false)
    private LocalDate payPeriodEnd;

    @Column(nullable = false)
    private BigDecimal baseSalary;
    private Double fullTimeWorkHours;
    private Double actualWorkHours;
    private Double overtimeHours;
    private BigDecimal overtimePay;
    private BigDecimal extraSalary;
    private BigDecimal ilPayout;
    private BigDecimal lateDeduction;
    private Integer lateMinutes;
    private BigDecimal taxDeduction;
    private BigDecimal insuranceDeduction;
    private BigDecimal otherDeductions;

    @Column(nullable = false)
    private BigDecimal grossSalary;

    @Column(nullable = false)
    private BigDecimal totalDeductions;

    @Column(nullable = false)
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;

    private LocalDate paymentDate;
    private String notes;

    public enum PayrollStatus { DRAFT, PROCESSED, PAID }
}
