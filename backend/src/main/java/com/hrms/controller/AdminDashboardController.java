package com.hrms.controller;

import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import com.hrms.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepo;
    private final LeaveService leaveService;
    private final PayrollService payrollService;

    @GetMapping("/dashboard/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "totalEmployees", userRepo.countByActiveTrue(),
            "attendanceRate", 94.5,
            "pendingLeaves", leaveService.countPending(),
            "totalPayroll", payrollService.sumPaidNet()
        );
    }
}
