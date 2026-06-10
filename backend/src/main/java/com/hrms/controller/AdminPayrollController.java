package com.hrms.controller;

import com.hrms.entity.Payroll;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;
import com.hrms.service.ActivityLogService;

@RestController
@RequestMapping("/api/v1/admin/payroll")
@RequiredArgsConstructor
public class AdminPayrollController {

    private final PayrollService payrollService;
    private final ActivityLogService activityLogService;

    @PostMapping("/calculate")
    public Payroll calculate(@RequestBody PayrollCalcRequest req) {
        Payroll p = payrollService.calculateAndCreate(
            req.getEmployeeId(), req.getFullTimeWorkHours(), req.getTaxDeduction(),
            req.getInsuranceDeduction(), req.getOtherDeductions(),
            req.getPayPeriodStart(), req.getPayPeriodEnd()
        );
        activityLogService.log("Payroll calculated for employee " + req.getEmployeeId(), "PAYROLL");
        return p;
    }

    @GetMapping
    public Page<Payroll> getPayrolls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size) {
        return payrollService.getAll(org.springframework.data.domain.PageRequest.of(page, size));
    }

    @GetMapping("/user/{userId}")
    public List<Payroll> getByUser(@PathVariable Long userId) {
        return payrollService.getByUser(userId);
    }

    @PutMapping("/{id}/process")
    public Payroll process(@PathVariable Long id) {
        Payroll p = payrollService.processPayroll(id);
        activityLogService.log("Payroll processed for " + p.getUser().getFirstName() + " " + p.getUser().getLastName(), "PAYROLL");
        return p;
    }

    @PutMapping("/{id}/pay")
    public Payroll pay(@PathVariable Long id) {
        Payroll p = payrollService.markPaid(id);
        activityLogService.log("Payroll paid for " + p.getUser().getFirstName() + " " + p.getUser().getLastName(), "PAYROLL");
        return p;
    }

    @GetMapping("/{id}")
    public Payroll getById(@PathVariable Long id) {
        return payrollService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        payrollService.delete(id);
    }

    @PutMapping("/{id}")
    public Payroll update(@PathVariable Long id, @RequestBody PayrollUpdateRequest req) {
        return payrollService.updatePayroll(id, req.getTaxDeduction(), req.getInsuranceDeduction(), req.getOtherDeductions(), req.getNotes());
    }

    @PostMapping("/bulk-process")
    public void bulkProcess() {
        payrollService.bulkProcess();
        activityLogService.log("Bulk payroll processing completed", "PAYROLL");
    }

    @PostMapping("/bulk-pay")
    public void bulkPay() {
        payrollService.bulkPay();
        activityLogService.log("Bulk payroll payment completed", "PAYROLL");
    }

    @GetMapping("/sum-paid")
    public BigDecimal sumPaidNet() {
        return payrollService.sumPaidNet();
    }

    @lombok.Data
    public static class PayrollCalcRequest {
        private String employeeId;
        private Double fullTimeWorkHours;
        private BigDecimal taxDeduction;
        private BigDecimal insuranceDeduction;
        private BigDecimal otherDeductions;
        private LocalDate payPeriodStart;
        private LocalDate payPeriodEnd;
    }

    @lombok.Data
    public static class PayrollUpdateRequest {
        private Long id;
        private BigDecimal taxDeduction;
        private BigDecimal insuranceDeduction;
        private BigDecimal otherDeductions;
        private String notes;
    }
}
