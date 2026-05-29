package com.hrms.service;

import com.hrms.entity.Payroll;
import com.hrms.entity.Payroll.PayrollStatus;
import com.hrms.entity.User;
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

    @Transactional
    public Payroll calculateAndCreate(Long userId, BigDecimal extraSalary, Double overtimeHours,
                                      BigDecimal overtimeRate, BigDecimal tax, BigDecimal insurance,
                                      BigDecimal otherDeductions) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (payrollRepo.findByUserIdAndPayPeriodStartAndPayPeriodEnd(userId,
                java.time.LocalDate.now().withDayOfMonth(1),
                java.time.LocalDate.now().withDayOfMonth(java.time.LocalDate.now().lengthOfMonth()))
                .isPresent())
            throw new RuntimeException("Payroll already exists for this period");

        BigDecimal rate = overtimeRate != null ? overtimeRate : new BigDecimal("25");
        double otHrs = overtimeHours != null ? overtimeHours : 0;
        BigDecimal otPay = rate.multiply(BigDecimal.valueOf(otHrs)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal extra = extraSalary != null ? extraSalary : BigDecimal.ZERO;
        BigDecimal taxAmt = tax != null ? tax : BigDecimal.ZERO;
        BigDecimal insAmt = insurance != null ? insurance : BigDecimal.ZERO;
        BigDecimal otherDed = otherDeductions != null ? otherDeductions : BigDecimal.ZERO;

        BigDecimal gross = user.getBaseSalary().add(extra).add(otPay);
        BigDecimal totalDed = taxAmt.add(insAmt).add(otherDed);
        BigDecimal net = gross.subtract(totalDed);

        Payroll p = Payroll.builder()
            .user(user)
            .payPeriodStart(java.time.LocalDate.now().withDayOfMonth(1))
            .payPeriodEnd(java.time.LocalDate.now().withDayOfMonth(java.time.LocalDate.now().lengthOfMonth()))
            .baseSalary(user.getBaseSalary())
            .overtimeRate(rate)
            .overtimeHours(otHrs)
            .overtimePay(otPay)
            .extraSalary(extra)
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

    public java.math.BigDecimal sumPaidNet() { return payrollRepo.sumPaidNet(); }
}
