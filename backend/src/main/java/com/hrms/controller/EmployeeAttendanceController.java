package com.hrms.controller;

import com.hrms.entity.Attendance;
import com.hrms.entity.User;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.UserRepository;
import com.hrms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/employee/attendance")
@RequiredArgsConstructor
public class EmployeeAttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepo;
    private final AttendanceRepository attendanceRepo;

    private User currentUser(UserDetails ud) {
        return userRepo.findByEmail(ud.getUsername()).orElseThrow();
    }

    @PostMapping("/clock-in")
    public ResponseEntity<Attendance> clockIn(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(attendanceService.clockIn(currentUser(ud).getId()));
    }

    @PostMapping("/clock-out")
    public ResponseEntity<Attendance> clockOut(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(attendanceService.clockOut(currentUser(ud).getId()));
    }

    @GetMapping("/today")
    public ResponseEntity<?> getToday(@AuthenticationPrincipal UserDetails ud) {
        User user = currentUser(ud);
        Attendance a = attendanceService.findByUserAndDate(user.getId(), LocalDate.now());
        return a != null ? ResponseEntity.ok(a) : ResponseEntity.ok(Map.of("clockInTime", null, "clockOutTime", null, "message", "Not clocked in today"));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getMyAttendance(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue = "2025-01-01") LocalDate from,
            @RequestParam(defaultValue = "2027-12-31") LocalDate to) {
        User user = currentUser(ud);
        return ResponseEntity.ok(
            attendanceRepo.findByUserIdAndDateBetweenOrderByDateDesc(user.getId(), from, to)
        );
    }
}
