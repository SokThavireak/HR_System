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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepo;
    private final UserRepository userRepo;
    private final AttendanceRepository attendanceRepo;

    @Async
    @Transactional
    public CompletableFuture<Payroll> calculateAndCreate(Long userId, Double fullTimeWorkHours, BigDecimal tax,
                                      BigDecimal insurance, BigDecimal otherDeductions,
                                      java.time.LocalDate periodStart, java.time.LocalDate periodEnd) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getBaseSalary() == null)
            throw new RuntimeException("Employee has no base salary set");
        if (fullTimeWorkHours == null || fullTimeWorkHours <= 0)
            throw new RuntimeException("Full-time work hours must be greater than 0");

        if (payrollRepo.findByUserIdAndPayPeriodStartAndPayPeriodEnd(userId, periodStart, periodEnd).isPresent())
            throw new RuntimeException("Payroll already exists for this period");

        // Monthly salary = annual / 12
        BigDecimal monthlySalary = user.getBaseSalary()
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        double actualWorkHours = calculateActualWorkHours(userId, periodStart, periodEnd);
        double overtimeHours = Math.max(0, actualWorkHours - fullTimeWorkHours);

        BigDecimal hourlyRate = monthlySalary
                .divide(BigDecimal.valueOf(fullTimeWorkHours), 2, RoundingMode.HALF_UP);

        BigDecimal overtimePay = hourlyRate
                .multiply(BigDecimal.valueOf(overtimeHours))
                .multiply(new BigDecimal("1.5"))
                .setScale(2, RoundingMode.HALF_UP);

        double extraHours = Math.max(0, actualWorkHours - fullTimeWorkHours);
        BigDecimal extraSalary = hourlyRate
                .multiply(BigDecimal.valueOf(extraHours))
                .setScale(2, RoundingMode.HALF_UP);

        int totalLateMinutes = calculateTotalLateMinutes(userId, periodStart, periodEnd);
        BigDecimal lateDeduction = calculateLateDeduction(userId, totalLateMinutes, monthlySalary,
                periodStart, periodEnd);

        // ── IL Payout: unused IL days paid at OT rate (once per year) ──
        BigDecimal ilPayout = BigDecimal.ZERO;
        if (Boolean.FALSE.equals(user.getUnusedIlPaid())) {
            int unusedIlDays = user.getIlLeaveEntitlement() - user.getIlLeaveUsed();
            if (unusedIlDays > 0) {
                ilPayout = hourlyRate
                    .multiply(BigDecimal.valueOf(unusedIlDays))
                    .multiply(BigDecimal.valueOf(8))
                    .multiply(new BigDecimal("1.5"))
                    .setScale(2, RoundingMode.HALF_UP);
                user.setUnusedIlPaid(true);
                userRepo.save(user);
            }
        }

        BigDecimal taxAmt = tax != null ? tax : BigDecimal.ZERO;
        BigDecimal insAmt = insurance != null ? insurance : BigDecimal.ZERO;
        BigDecimal otherDed = otherDeductions != null ? otherDeductions : BigDecimal.ZERO;

        BigDecimal gross = monthlySalary.add(extraSalary).add(overtimePay).add(ilPayout);
        BigDecimal totalDed = taxAmt.add(insAmt).add(otherDed).add(lateDeduction);
        BigDecimal net = gross.subtract(totalDed);

        Payroll p = Payroll.builder()
            .user(user)
            .payPeriodStart(periodStart)
            .payPeriodEnd(periodEnd)
            .baseSalary(monthlySalary)
            .fullTimeWorkHours(fullTimeWorkHours)
            .actualWorkHours(actualWorkHours)
            .overtimeHours(overtimeHours)
            .overtimePay(overtimePay)
            .extraSalary(extraSalary)
            .ilPayout(ilPayout)
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
        return CompletableFuture.completedFuture(payrollRepo.save(p));
    }

    private double calculateActualWorkHours(Long userId, java.time.LocalDate start, java.time.LocalDate end) {
        Double sum = attendanceRepo.sumHoursWorked(userId, start, end);
        return sum != null ? sum : 0.0;
    }

    private int calculateTotalLateMinutes(Long userId, java.time.LocalDate start, java.time.LocalDate end) {
        Integer sum = attendanceRepo.sumLateMinutesExcludingLeave(userId, start, end);
        return sum != null ? sum : 0;
    }

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

    @Async
    public CompletableFuture<Page<Payroll>> getAll(Pageable page) {
        return CompletableFuture.completedFuture(payrollRepo.findAllByOrderByPayPeriodEndDesc(page));
    }

    @Async
    public CompletableFuture<List<Payroll>> getByUser(Long userId) {
        return CompletableFuture.completedFuture(payrollRepo.findByUserIdOrderByPayPeriodEndDesc(userId));
    }

    @Async
    @Transactional
    public CompletableFuture<Payroll> processPayroll(Long id) {
        Payroll p = payrollRepo.findByIdWithUser(id).orElseThrow();
        p.setStatus(PayrollStatus.PROCESSED);
        return CompletableFuture.completedFuture(payrollRepo.save(p));
    }

    @Async
    @Transactional
    public CompletableFuture<Payroll> markPaid(Long id) {
        Payroll p = payrollRepo.findByIdWithUser(id).orElseThrow();
        p.setStatus(PayrollStatus.PAID);
        p.setPaymentDate(java.time.LocalDate.now());
        return CompletableFuture.completedFuture(payrollRepo.save(p));
    }

    @Async
    public CompletableFuture<Payroll> getById(Long id) {
        return CompletableFuture.completedFuture(
            payrollRepo.findByIdWithUser(id).orElseThrow(() -> new RuntimeException("Payroll not found"))
        );
    }

    @Async
    @Transactional
    public CompletableFuture<Void> delete(Long id) {
        payrollRepo.deleteById(id);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Transactional
    public CompletableFuture<Void> bulkProcess() {
        payrollRepo.findAllByStatus(PayrollStatus.DRAFT).forEach(p -> {
            p.setStatus(PayrollStatus.PROCESSED);
            payrollRepo.save(p);
        });
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Transactional
    public CompletableFuture<Payroll> updatePayroll(Long id, BigDecimal taxDeduction, BigDecimal insuranceDeduction,
                                                    BigDecimal otherDeductions, String notes) {
        Payroll p = payrollRepo.findByIdWithUser(id).orElseThrow(() -> new RuntimeException("Payroll not found"));
        if (taxDeduction != null) p.setTaxDeduction(taxDeduction);
        if (insuranceDeduction != null) p.setInsuranceDeduction(insuranceDeduction);
        if (otherDeductions != null) p.setOtherDeductions(otherDeductions);
        if (notes != null) p.setNotes(notes);

        // Recalculate gross, total deductions, net
        BigDecimal totalDed = p.getTaxDeduction().add(p.getInsuranceDeduction()).add(p.getOtherDeductions()).add(p.getLateDeduction() != null ? p.getLateDeduction() : BigDecimal.ZERO);
        BigDecimal gross = p.getBaseSalary().add(p.getExtraSalary() != null ? p.getExtraSalary() : BigDecimal.ZERO).add(p.getOvertimePay() != null ? p.getOvertimePay() : BigDecimal.ZERO).add(p.getIlPayout() != null ? p.getIlPayout() : BigDecimal.ZERO);
        p.setGrossSalary(gross);
        p.setTotalDeductions(totalDed);
        p.setNetSalary(gross.subtract(totalDed));

        return CompletableFuture.completedFuture(payrollRepo.save(p));
    }

    @Async
    public CompletableFuture<BigDecimal> sumPaidNet() {
        return CompletableFuture.completedFuture(payrollRepo.sumPaidNet());
    }
}
