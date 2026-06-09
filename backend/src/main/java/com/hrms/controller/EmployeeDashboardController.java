package com.hrms.controller;

import com.hrms.entity.User;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.PayrollRepository;
import com.hrms.repository.PerformanceReviewRepository;
import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final UserRepository userRepo;
    private final PayrollRepository payrollRepo;
    private final AttendanceRepository attendanceRepo;
    private final LeaveService leaveService;
    private final PerformanceReviewRepository repo;

    private User currentUser(UserDetails ud) {
        return userRepo.findByEmail(ud.getUsername()).orElseThrow();
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@AuthenticationPrincipal UserDetails ud) {
        User user = currentUser(ud);
        var now = LocalDate.now();
        var startOfMonth = now.withDayOfMonth(1);
        Long presentDays = attendanceRepo.countPresentDays(user.getId(), startOfMonth, now);
        Double overtime = attendanceRepo.sumOvertimeByUserAndPeriod(user.getId(), startOfMonth, now);
        long totalDaysOfMonth = now.getDayOfMonth();
        double attendanceRate = totalDaysOfMonth > 0 ? Math.round((presentDays * 100.0 / totalDaysOfMonth) * 10.0) / 10.0 : 0;
        var payslips = payrollRepo.findByUserIdOrderByPayPeriodEndDesc(user.getId());
        String lastPay = payslips.isEmpty() ? "0" : payslips.get(0).getNetSalary().toString();

        return ResponseEntity.ok(Map.of(
            "presentDays", presentDays != null ? presentDays : 0,
            "overtimeHours", overtime != null ? overtime : 0,
            "attendanceRate", attendanceRate,
            "pendingLeaves", leaveService.countPending(),
            "lastPaySlip", lastPay
        ));
    }

    @GetMapping("/payslips")
    public ResponseEntity<?> getPaySlips(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(payrollRepo.findByUserIdOrderByPayPeriodEndDesc(currentUser(ud).getId()));
    }

    @GetMapping("/performance")
    public ResponseEntity<?> getPerformance(@AuthenticationPrincipal UserDetails ud) {
        User user = currentUser(ud);
        return ResponseEntity.ok(
            repo.findByEmployeeIdOrderByCreatedAtDesc(user.getId(), org.springframework.data.domain.PageRequest.of(0, 20))
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(currentUser(ud));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails ud,
                                               @RequestBody Map<String, String> body) {
        User user = currentUser(ud);
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        return ResponseEntity.ok(userRepo.save(user));
    }
}
