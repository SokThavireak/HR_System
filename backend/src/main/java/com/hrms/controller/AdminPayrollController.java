package com.hrms.controller;

import com.hrms.entity.Payroll;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/payroll")
@RequiredArgsConstructor
public class AdminPayrollController {

    private final PayrollService payrollService;

    @PostMapping("/calculate")
    public Payroll calculate(@RequestBody PayrollCalcRequest req) {
        return payrollService.calculateAndCreate(
            req.getUserId(), req.getExtraSalary(), req.getOvertimeHours(),
            req.getOvertimeRate(), req.getTaxDeduction(), req.getInsuranceDeduction(),
            req.getOtherDeductions());
    }

    @GetMapping
    public Page<Payroll> getPayrolls(@RequestParam(defaultValue = "0") int page) {
        return payrollService.getAll(PageRequest.of(page, 20));
    }

    @PutMapping("/{id}/process")
    public Payroll process(@PathVariable Long id) { return payrollService.processPayroll(id); }

    @PutMapping("/{id}/pay")
    public Payroll pay(@PathVariable Long id) { return payrollService.markPaid(id); }

    @lombok.Data
    public static class PayrollCalcRequest {
        private Long userId;
        private BigDecimal extraSalary;
        private Double overtimeHours;
        private BigDecimal overtimeRate;
        private BigDecimal taxDeduction;
        private BigDecimal insuranceDeduction;
        private BigDecimal otherDeductions;
    }
}
