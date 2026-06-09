package com.hrms.controller;

import com.hrms.entity.Attendance;
import com.hrms.entity.Attendance.AttendanceStatus;
import com.hrms.entity.User;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/attendance")
@RequiredArgsConstructor
public class AdminAttendanceController {

    private final AttendanceRepository attendanceRepo;
    private final UserRepository userRepo;
    private final com.hrms.repository.LeaveRequestRepository leaveRepo;

    @GetMapping
    public Page<Attendance> getAttendance(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Pageable page) {
        if (id != null) {
            return attendanceRepo.findById(id)
                    .map(java.util.Collections::singletonList)
                    .map(list -> new org.springframework.data.domain.PageImpl<>(list, page, 1))
                    .orElseGet(() -> new org.springframework.data.domain.PageImpl<>(java.util.Collections.emptyList(), page, 0));
        }
        if (employeeId != null && !employeeId.isBlank()) {
            User user = userRepo.findByEmployeeId(employeeId).orElseThrow(() -> new RuntimeException("User not found"));
            if (from != null && to != null) {
                return attendanceRepo.findByUserIdAndDateBetweenOrderByDateDesc(user.getId(), from, to, page);
            }
            return attendanceRepo.findByUserOrderByDateDesc(user, page);
        }
        if (userId != null && from != null && to != null) {
            return attendanceRepo.findByUserIdAndDateBetweenOrderByDateDesc(userId, from, to, page);
        }
        if (from != null && to != null) {
            return attendanceRepo.findByDateBetween(from, to, page);
        }
        if (userId != null) {
            User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            return attendanceRepo.findByUserOrderByDateDesc(user, page);
        }
        return attendanceRepo.findAll(page);
    }

    @GetMapping("/{id}")
    public Attendance getById(@PathVariable Long id) {
        return attendanceRepo.findById(id).orElseThrow(() -> new RuntimeException("Attendance not found"));
    }

    @PostMapping("/manual")
    public Attendance createManual(@RequestBody ManualEntryRequest req) {
        User user = userRepo.findById(req.getEmployeeId()).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate date = req.getDate() != null ? req.getDate() : LocalDate.now();
        LocalDateTime clockIn = req.getClockIn() != null ? date.atTime(java.time.LocalTime.parse(req.getClockIn())) : null;
        LocalDateTime clockOut = req.getClockOut() != null ? date.atTime(java.time.LocalTime.parse(req.getClockOut())) : null;
        double hours = 0;
        if (clockIn != null && clockOut != null) {
            hours = java.time.temporal.ChronoUnit.MINUTES.between(clockIn, clockOut) / 60.0;
            hours = Math.round(hours * 100.0) / 100.0;
        }
        AttendanceStatus status = req.getStatus() != null ? req.getStatus() : AttendanceStatus.PRESENT;
        Attendance attendance = Attendance.builder()
            .user(user)
            .date(date)
            .clockInTime(clockIn)
            .clockOutTime(clockOut)
            .status(status)
            .hoursWorked(hours)
            .clockInNote(req.getNote())
            .build();
        return attendanceRepo.save(attendance);
    }

    @GetMapping("/employee/{userId}")
    public Page<Attendance> getByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Pageable page) {
        if (from != null && to != null) {
            return attendanceRepo.findByUserIdAndDateBetweenOrderByDateDesc(userId, from, to, page);
        }
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return attendanceRepo.findByUserOrderByDateDesc(user, page);
    }

    @GetMapping("/export")
    public org.springframework.http.ResponseEntity<String> export(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Long userId) {
        StringBuilder csv = new StringBuilder("Employee,Date,Clock In,Clock Out,Hours,Status\n");
        // Simple CSV export — in production use a proper CSV library
        csv.append("Export not fully implemented — use summary endpoint for data");
        return org.springframework.http.ResponseEntity.ok()
            .header("Content-Type", "text/csv")
            .header("Content-Disposition", "attachment; filename=\"attendance_" + from + "_" + to + ".csv\"")
            .body(csv.toString());
    }

    @PostMapping
    public Attendance create(@RequestBody AttendanceRequest req) {
        User user = userRepo.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Attendance attendance = Attendance.builder()
            .user(user)
            .date(req.getDate())
            .clockInTime(req.getClockInTime())
            .clockOutTime(req.getClockOutTime())
            .status(req.getStatus() != null ? req.getStatus() : AttendanceStatus.PRESENT)
            .hoursWorked(req.getHoursWorked())
            .overtimeHours(req.getOvertimeHours())
            .lateMinutes(req.getLateMinutes())
            .clockInNote(req.getClockInNote())
            .clockOutNote(req.getClockOutNote())
            .build();
        return attendanceRepo.save(attendance);
    }

    @PutMapping("/{id}")
    public Attendance update(@PathVariable Long id, @RequestBody AttendanceRequest req) {
        Attendance attendance = attendanceRepo.findById(id).orElseThrow(() -> new RuntimeException("Attendance not found"));
        if (req.getDate() != null) attendance.setDate(req.getDate());
        if (req.getClockInTime() != null) attendance.setClockInTime(req.getClockInTime());
        if (req.getClockOutTime() != null) attendance.setClockOutTime(req.getClockOutTime());
        if (req.getStatus() != null) attendance.setStatus(req.getStatus());
        if (req.getHoursWorked() != null) attendance.setHoursWorked(req.getHoursWorked());
        if (req.getOvertimeHours() != null) attendance.setOvertimeHours(req.getOvertimeHours());
        if (req.getLateMinutes() != null) attendance.setLateMinutes(req.getLateMinutes());
        if (req.getClockInNote() != null) attendance.setClockInNote(req.getClockInNote());
        if (req.getClockOutNote() != null) attendance.setClockOutNote(req.getClockOutNote());
        return attendanceRepo.save(attendance);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        attendanceRepo.deleteById(id);
    }

    @GetMapping("/summary")
    public AttendanceSummary getSummary(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        // Default to current month if not provided
        if (from == null || to == null) {
            LocalDate now = LocalDate.now();
            from = now.withDayOfMonth(1);
            to = now.withDayOfMonth(now.lengthOfMonth());
        }
        // Resolve userId from employeeId if provided
        if (userId == null && employeeId != null && !employeeId.isBlank()) {
            userId = userRepo.findByEmployeeId(employeeId).map(User::getId).orElse(null);
        }
        // If no userId, return aggregate zeros (frontend will compute from records)
        if (userId == null) {
            return new AttendanceSummary(0.0, 0.0, 0L, 0, 0L, 0L, 0L, 0L, 0, 0, 0, 0, 0, 0);
        }
        Double totalHours = attendanceRepo.sumHoursWorked(userId, from, to);
        Double totalOvertime = attendanceRepo.sumOvertimeByUserAndPeriod(userId, from, to);
        Long presentDays = attendanceRepo.countPresentDays(userId, from, to);
        Integer totalLateMinutes = attendanceRepo.sumLateMinutesExcludingLeave(userId, from, to);
        Long lateDays = attendanceRepo.countLateDaysExcludingLeave(userId, from, to);

        // Leave counts by type within the date range
        long ilDays = leaveRepo.countByUserAndTypeAndDateRange(userId, com.hrms.entity.LeaveRequest.LeaveType.IL, from, to);
        long sickDays = leaveRepo.countByUserAndTypeAndDateRange(userId, com.hrms.entity.LeaveRequest.LeaveType.SICK, from, to);
        long specialDays = leaveRepo.countByUserAndTypeAndDateRange(userId, com.hrms.entity.LeaveRequest.LeaveType.SPECIAL, from, to);

        // Fetch entitlements from user; compute used counts dynamically from approved leaves
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return new AttendanceSummary(
            totalHours, totalOvertime, presentDays, totalLateMinutes, lateDays,
            ilDays, sickDays, specialDays,
            user.getIlLeaveEntitlement(), (int) ilDays,
            user.getSickLeaveEntitlement(), (int) sickDays,
            user.getSpecialLeaveEntitlement(), (int) specialDays
        );
    }

    @lombok.Data
    public static class ManualEntryRequest {
        private Long employeeId;
        private LocalDate date;
        private String clockIn;
        private String clockOut;
        private AttendanceStatus status;
        private String note;
    }

    @lombok.Data
    public static class AttendanceRequest {
        private Long userId;
        private LocalDate date;
        private java.time.LocalDateTime clockInTime;
        private java.time.LocalDateTime clockOutTime;
        private AttendanceStatus status;
        private Double hoursWorked;
        private Double overtimeHours;
        private Integer lateMinutes;
        private String clockInNote;
        private String clockOutNote;
    }

    public record AttendanceSummary(
        Double totalHoursWorked,
        Double totalOvertimeHours,
        Long presentDays,
        Integer totalLateMinutes,
        Long lateDays,
        Long ilLeaveDays,
        Long sickLeaveDays,
        Long specialLeaveDays,
        Integer ilEntitlement,
        Integer ilUsed,
        Integer sickEntitlement,
        Integer sickUsed,
        Integer specialEntitlement,
        Integer specialUsed
    ) {}
}
