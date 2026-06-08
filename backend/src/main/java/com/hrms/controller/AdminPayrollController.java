package com.hrms.controller;

import com.hrms.entity.Payroll;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/admin/payroll")
@RequiredArgsConstructor
public class AdminPayrollController {

    private final PayrollService payrollService;

    @PostMapping("/calculate")
    public Payroll calculate(@RequestBody PayrollCalcRequest req) {
        return payrollService.calculateAndCreate(
            req.getUserId(), req.getFullTimeWorkHours(), req.getTaxDeduction(),
            req.getInsuranceDeduction(), req.getOtherDeductions(),
            req.getPayPeriodStart(), req.getPayPeriodEnd()
        ).join();
    }

    @GetMapping
    public Page<Payroll> getPayrolls(@RequestParam(defaultValue = "0") int page) {
        return payrollService.getAll(org.springframework.data.domain.PageRequest.of(page, 20)).join();
    }

    @GetMapping("/user/{userId}")
    public List<Payroll> getByUser(@PathVariable Long userId) {
        return payrollService.getByUser(userId).join();
    }

    @PutMapping("/{id}/process")
    public Payroll process(@PathVariable Long id) {
        return payrollService.processPayroll(id).join();
    }

    @PutMapping("/{id}/pay")
    public Payroll pay(@PathVariable Long id) {
        return payrollService.markPaid(id).join();
    }

    @GetMapping("/{id}")
    public Payroll getById(@PathVariable Long id) {
        return payrollService.getById(id).join();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        payrollService.delete(id).join();
    }

    @PutMapping("/{id}")
    public Payroll update(@PathVariable Long id, @RequestBody PayrollUpdateRequest req) {
        return payrollService.updatePayroll(id, req.getTaxDeduction(), req.getInsuranceDeduction(), req.getOtherDeductions(), req.getNotes()).join();
    }

    @PostMapping("/bulk-process")
    public void bulkProcess() {
        payrollService.bulkProcess().join();
    }

    @GetMapping("/sum-paid")
    public BigDecimal sumPaidNet() {
        return payrollService.sumPaidNet().join();
    }

    @lombok.Data
    public static class PayrollCalcRequest {
        private Long userId;
        private Double fullTimeWorkHours;
        private BigDecimal taxDeduction;
        private BigDecimal insuranceDeduction;
        private BigDecimal otherDeductions;
        private LocalDate payPeriodStart;
        private LocalDate payPeriodEnd;
    }

    @lombok.Data
    public static class PayrollUpdateRequest {
        private BigDecimal taxDeduction;
        private BigDecimal insuranceDeduction;
        private BigDecimal otherDeductions;
        private String notes;
    }
}
