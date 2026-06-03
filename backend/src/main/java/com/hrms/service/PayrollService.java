package com.hrms.service;

import com.hrms.entity.Payroll;
import com.hrms.entity.Payroll.PayrollStatus;
import com.hrms.entity.User;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.PayrollRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepo;
    private final UserRepository userRepo;
    private final AttendanceRepository attendanceRepo;

    @Transactional
    public Payroll calculateAndCreate(Long userId, Double fullTimeWorkHours, BigDecimal tax,
                                      BigDecimal insurance, BigDecimal otherDeductions,
                                      java.time.LocalDate periodStart, java.time.LocalDate periodEnd) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getBaseSalary() == null)
            throw new RuntimeException("Employee has no base salary set");
        if (fullTimeWorkHours == null || fullTimeWorkHours <= 0)
            throw new RuntimeException("Full-time work hours must be greater than 0");

        if (payrollRepo.findByUserIdAndPayPeriodStartAndPayPeriodEnd(userId, periodStart, periodEnd).isPresent())
            throw new RuntimeException("Payroll already exists for this period");

        // Calculate actual work hours from attendance records
        double actualWorkHours = calculateActualWorkHours(userId, periodStart, periodEnd);

        // Overtime = actual - fullTime (only if positive)
        double overtimeHours = Math.max(0, actualWorkHours - fullTimeWorkHours);

        // Hourly rate = baseSalary / fullTimeWorkHours
        BigDecimal hourlyRate = user.getBaseSalary()
                .divide(BigDecimal.valueOf(fullTimeWorkHours), 2, RoundingMode.HALF_UP);

        // Overtime pay = overtimeHours * hourlyRate * 1.5 (time-and-a-half)
        BigDecimal overtimePay = hourlyRate
                .multiply(BigDecimal.valueOf(overtimeHours))
                .multiply(new BigDecimal("1.5"))
                .setScale(2, RoundingMode.HALF_UP);

        // Extra salary = (baseSalary / fullTimeWorkHours) * (actualWorkHours - fullTimeWorkHours)
        // This is the prorated amount for hours worked beyond full time, at normal rate
        double extraHours = Math.max(0, actualWorkHours - fullTimeWorkHours);
        BigDecimal extraSalary = hourlyRate
                .multiply(BigDecimal.valueOf(extraHours))
                .setScale(2, RoundingMode.HALF_UP);

        // Calculate late deductions from attendance
        int totalLateMinutes = calculateTotalLateMinutes(userId, periodStart, periodEnd);
        BigDecimal lateDeduction = calculateLateDeduction(userId, totalLateMinutes, user.getBaseSalary(),
                periodStart, periodEnd);

        BigDecimal taxAmt = tax != null ? tax : BigDecimal.ZERO;
        BigDecimal insAmt = insurance != null ? insurance : BigDecimal.ZERO;
        BigDecimal otherDed = otherDeductions != null ? otherDeductions : BigDecimal.ZERO;

        BigDecimal gross = user.getBaseSalary().add(extraSalary).add(overtimePay);
        BigDecimal totalDed = taxAmt.add(insAmt).add(otherDed).add(lateDeduction);
        BigDecimal net = gross.subtract(totalDed);

        Payroll p = Payroll.builder()
            .user(user)
            .payPeriodStart(periodStart)
            .payPeriodEnd(periodEnd)
            .baseSalary(user.getBaseSalary())
            .fullTimeWorkHours(fullTimeWorkHours)
            .actualWorkHours(actualWorkHours)
            .overtimeHours(overtimeHours)
            .overtimePay(overtimePay)
            .extraSalary(extraSalary)
            .lateDeduction(lateDeduction)
            .lateMinutes(totalLateMinutes)
            .taxDeduction(taxAmt)
            .insuranceDeduction(insAmt)
            .otherDeductions(otherDed)
            .grossSalary(gross)
            .totalDeductions(totalDed)
            .netSalary(net)
            .status(PayrollStatus.DRAFT)
            .build();
        return payrollRepo.save(p);
    }

    /**
     * Sum hoursWorked from attendance records within the given date range.
     */
    private double calculateActualWorkHours(Long userId, java.time.LocalDate start, java.time.LocalDate end) {
        Double sum = attendanceRepo.sumHoursWorked(userId, start, end);
        return sum != null ? sum : 0.0;
    }

    /**
     * Sum late minutes from attendance records, excluding leave days.
     */
    private int calculateTotalLateMinutes(Long userId, java.time.LocalDate start, java.time.LocalDate end) {
        Integer sum = attendanceRepo.sumLateMinutesExcludingLeave(userId, start, end);
        return sum != null ? sum : 0;
    }

    /**
     * Calculate late deduction based on total late minutes.
     * Rules (per late instance):
     *   1-30 min  → $5
     *   31-60 min → $15
     *   60+ min   → 50% of daily salary
     * Daily salary = baseSalary / workingDaysInMonth (default 26)
     */
    private BigDecimal calculateLateDeduction(Long userId, int totalLateMinutes, BigDecimal baseSalary,
                                               java.time.LocalDate periodStart, java.time.LocalDate periodEnd) {
        if (totalLateMinutes <= 0) return BigDecimal.ZERO;

        long lateDays = attendanceRepo.countLateDaysExcludingLeave(userId, periodStart, periodEnd);
        if (lateDays == 0) return BigDecimal.ZERO;

        int avgLatePerDay = totalLateMinutes / (int) lateDays;

        BigDecimal dailySalary = baseSalary.divide(BigDecimal.valueOf(26), 2, RoundingMode.HALF_UP);

        BigDecimal deductionPerDay;
        if (avgLatePerDay > 60) {
            deductionPerDay = dailySalary.multiply(new BigDecimal("0.5"));
        } else if (avgLatePerDay > 30) {
            deductionPerDay = new BigDecimal("15");
        } else {
            deductionPerDay = new BigDecimal("5");
        }

        return deductionPerDay.multiply(BigDecimal.valueOf(lateDays)).setScale(2, RoundingMode.HALF_UP);
    }

    public Page<Payroll> getAll(Pageable page) {
        return payrollRepo.findAllByOrderByPayPeriodEndDesc(page);
    }

    public java.util.List<Payroll> getByUser(Long userId) {
        return payrollRepo.findByUserIdOrderByPayPeriodEndDesc(userId);
    }

    @Transactional
    public Payroll processPayroll(Long id) {
        Payroll p = payrollRepo.findById(id).orElseThrow();
        p.setStatus(PayrollStatus.PROCESSED);
        return payrollRepo.save(p);
    }

    @Transactional
    public Payroll markPaid(Long id) {
        Payroll p = payrollRepo.findById(id).orElseThrow();
        p.setStatus(PayrollStatus.PAID);
        p.setPaymentDate(java.time.LocalDate.now());
        return payrollRepo.save(p);
    }

    public Payroll getById(Long id) { return payrollRepo.findById(id).orElseThrow(() -> new RuntimeException("Payroll not found")); }

    public void delete(Long id) { payrollRepo.deleteById(id); }

    @Transactional
    public void bulkProcess() {
        payrollRepo.findAllByStatus(PayrollStatus.DRAFT).forEach(p -> {
            p.setStatus(PayrollStatus.PROCESSED);
            payrollRepo.save(p);
        });
    }

    public java.math.BigDecimal sumPaidNet() { return payrollRepo.sumPaidNet(); }
}
