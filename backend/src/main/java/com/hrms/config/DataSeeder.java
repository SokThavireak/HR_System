package com.hrms.config;

import com.hrms.entity.*;
import com.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final LeaveRequestRepository leaveRepo;
    private final PayrollRepository payrollRepo;
    private final PerformanceReviewRepository reviewRepo;
    private final AttendanceRepository attendanceRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // Roles
        Role adminRole = roleRepo.save(new Role(Role.RoleName.ROLE_HR_ADMIN, "HR Administrator"));
        Role empRole   = roleRepo.save(new Role(Role.RoleName.ROLE_EMPLOYEE, "Employee"));

        // Admin user
        User admin = User.builder()
            .email("admin@hrms.com")
            .password(encoder.encode("admin123"))
            .firstName("Sarah").lastName("Johnson")
            .phone("+1-555-0100").department("Human Resources").position("HR Director")
            .baseSalary(new BigDecimal("8500")).hireDate(LocalDate.of(2022, 1, 15))
            .active(true).build();
        admin.getRoles().add(adminRole);
        admin = userRepo.save(admin);

        // Employee users
        User emp1 = User.builder()
            .email("john@hrms.com")
            .password(encoder.encode("john123"))
            .firstName("John").lastName("Doe")
            .phone("+1-555-0101").department("Engineering").position("Software Engineer")
            .baseSalary(new BigDecimal("5500")).hireDate(LocalDate.of(2023, 3, 1))
            .active(true).build();
        emp1.getRoles().add(empRole);
        emp1 = userRepo.save(emp1);

        User emp2 = User.builder()
            .email("jane@hrms.com")
            .password(encoder.encode("jane123"))
            .firstName("Jane").lastName("Smith")
            .phone("+1-555-0102").department("Marketing").position("Marketing Manager")
            .baseSalary(new BigDecimal("6000")).hireDate(LocalDate.of(2023, 6, 15))
            .active(true).build();
        emp2.getRoles().add(empRole);
        emp2 = userRepo.save(emp2);

        // Leave requests
        LeaveRequest l1 = LeaveRequest.builder().user(emp1).leaveType(LeaveRequest.LeaveType.ANNUAL)
            .startDate(LocalDate.now().plusDays(5)).endDate(LocalDate.now().plusDays(10))
            .totalDays(6).reason("Family vacation").status(LeaveRequest.LeaveStatus.PENDING).build();
        leaveRepo.save(l1);

        LeaveRequest l2 = LeaveRequest.builder().user(emp2).leaveType(LeaveRequest.LeaveType.SICK)
            .startDate(LocalDate.now().plusDays(1)).endDate(LocalDate.now().plusDays(2))
            .totalDays(2).reason("Flu recovery").status(LeaveRequest.LeaveStatus.PENDING).build();
        leaveRepo.save(l2);

        LeaveRequest l3 = LeaveRequest.builder().user(emp1).leaveType(LeaveRequest.LeaveType.ANNUAL)
            .startDate(LocalDate.now().minusDays(20)).endDate(LocalDate.now().minusDays(15))
            .totalDays(6).reason("Trip to mountains").status(LeaveRequest.LeaveStatus.APPROVED)
            .approvedBy(admin).approvedAt(LocalDateTime.now().minusDays(22)).build();
        leaveRepo.save(l3);

        // Payroll records
        Payroll p1 = Payroll.builder().user(emp1)
            .payPeriodStart(LocalDate.now().withDayOfMonth(1))
            .payPeriodEnd(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()))
            .baseSalary(new BigDecimal("5500")).overtimeRate(new BigDecimal("25"))
            .overtimeHours(8.0).overtimePay(new BigDecimal("200"))
            .extraSalary(new BigDecimal("300"))
            .taxDeduction(new BigDecimal("825")).insuranceDeduction(new BigDecimal("250")).otherDeductions(BigDecimal.ZERO)
            .grossSalary(new BigDecimal("6000")).totalDeductions(new BigDecimal("1075"))
            .netSalary(new BigDecimal("4925")).status(Payroll.PayrollStatus.DRAFT).build();
        payrollRepo.save(p1);

        Payroll p2 = Payroll.builder().user(emp2)
            .payPeriodStart(LocalDate.now().withDayOfMonth(1))
            .payPeriodEnd(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()))
            .baseSalary(new BigDecimal("6000")).overtimeRate(new BigDecimal("30"))
            .overtimeHours(4.0).overtimePay(new BigDecimal("120"))
            .extraSalary(BigDecimal.ZERO)
            .taxDeduction(new BigDecimal("918")).insuranceDeduction(new BigDecimal("280")).otherDeductions(BigDecimal.ZERO)
            .grossSalary(new BigDecimal("6120")).totalDeductions(new BigDecimal("1198"))
            .netSalary(new BigDecimal("4922")).status(Payroll.PayrollStatus.DRAFT).build();
        payrollRepo.save(p2);

        Payroll p3 = Payroll.builder().user(emp1)
            .payPeriodStart(LocalDate.now().minusMonths(1).withDayOfMonth(1))
            .payPeriodEnd(LocalDate.now().minusMonths(1).withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth()))
            .baseSalary(new BigDecimal("5500")).overtimeRate(new BigDecimal("25"))
            .overtimeHours(5.0).overtimePay(new BigDecimal("125"))
            .extraSalary(new BigDecimal("200"))
            .taxDeduction(new BigDecimal("788")).insuranceDeduction(new BigDecimal("250")).otherDeductions(BigDecimal.ZERO)
            .grossSalary(new BigDecimal("5825")).totalDeductions(new BigDecimal("1038"))
            .netSalary(new BigDecimal("4787")).status(Payroll.PayrollStatus.PAID)
            .paymentDate(LocalDate.now().minusMonths(1).withDayOfMonth(28)).build();
        payrollRepo.save(p3);

        // Performance review
        reviewRepo.save(PerformanceReview.builder().employee(emp1).reviewer(admin)
            .reviewPeriodStart(LocalDate.of(2024, 1, 1)).reviewPeriodEnd(LocalDate.of(2024, 6, 30))
            .qualityScore(4).productivityScore(5).communicationScore(4).teamworkScore(4).punctualityScore(5)
            .overallScore(4.4).feedback("Excellent work this quarter. Great contributions to the backend redesign.")
            .goals("Lead the Q3 microservices migration").improvements("Improve documentation skills")
            .build());

        reviewRepo.save(PerformanceReview.builder().employee(emp2).reviewer(admin)
            .reviewPeriodStart(LocalDate.of(2024, 1, 1)).reviewPeriodEnd(LocalDate.of(2024, 6, 30))
            .qualityScore(5).productivityScore(4).communicationScore(5).teamworkScore(5).punctualityScore(4)
            .overallScore(4.6).feedback("Outstanding leadership on the summer campaign.")
            .goals("Expand team to 3 junior marketers").improvements("Explore AI-driven analytics")
            .build());

        // Today's attendance (John already clocked in)
        attendanceRepo.save(Attendance.builder().user(emp1).date(LocalDate.now())
            .clockInTime(LocalDateTime.now().withHour(8).withMinute(52))
            .status(Attendance.AttendanceStatus.PRESENT).build());

        attendanceRepo.save(Attendance.builder().user(emp2).date(LocalDate.now())
            .clockInTime(LocalDateTime.now().withHour(9).withMinute(30))
            .status(Attendance.AttendanceStatus.LATE).build());
    }
}
