package com.hrms.controller;

import com.hrms.entity.User;
import com.hrms.entity.Attendance.AttendanceStatus;
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
        long presentDays = attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.PRESENT, startOfMonth, now) != null ? attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.PRESENT, startOfMonth, now) : 0;
        long lateDays = attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.LATE, startOfMonth, now) != null ? attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.LATE, startOfMonth, now) : 0;
        long absentDays = attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.ABSENT, startOfMonth, now) != null ? attendanceRepo.countByUserIdAndStatusAndDateBetween(user.getId(), AttendanceStatus.ABSENT, startOfMonth, now) : 0;
        Double totalHours = attendanceRepo.sumHoursWorked(user.getId(), startOfMonth, now);

        long totalDays = presentDays + lateDays + absentDays;
        double attendanceRate = 0.0;
        if (totalDays > 0) {
            double score = (presentDays * 5.0 + lateDays * 3.0 + absentDays * 1.0) / totalDays;
            attendanceRate = Math.max(1.0, Math.min(5.0, score));
        }

        var payslips = payrollRepo.findByUserIdOrderByPayPeriodEndDesc(user.getId());
        String lastPay = payslips.isEmpty() ? "0" : payslips.get(0).getNetSalary().toString();

        return ResponseEntity.ok(Map.of(
            "presentDays", presentDays,
            "lateDays", lateDays,
            "absentDays", absentDays,
            "totalHours", totalHours != null ? totalHours : 0.0,
            "attendanceRate", Math.round(attendanceRate * 10.0) / 10.0,
            "pendingLeaves", leaveService.countPendingByUser(user.getId()),
            "lastPaySlip", lastPay,
            "leaveBalance", leaveService.getLeaveBalance(user.getId())
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
