package com.hrms.controller;

import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepo;
    private final LeaveService leaveService;
    private final PayrollService payrollService;
    private final AttendanceRepository attendanceRepo;

    @GetMapping("/dashboard/stats")
    public Map<String, Object> getStats() {
        long totalEmployees = userRepo.countByActiveTrue();

        // Calculate attendance rate from real data (current month)
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        long totalSlots = totalEmployees * 21; // approx work days
        long presentDays = attendanceRepo.countByStatus(monthStart, monthEnd);
        double attendanceRate = totalSlots > 0
            ? BigDecimal.valueOf(presentDays * 100.0 / totalSlots).setScale(1, RoundingMode.HALF_UP).doubleValue()
            : 0.0;

        return Map.of(
            "totalEmployees", totalEmployees,
            "attendanceRate", attendanceRate,
            "pendingLeaves", leaveService.countPending(),
            "totalPayroll", payrollService.sumPaidNet(),
            "departmentBreakdown", userRepo.countByDepartment()
        );
    }
}
