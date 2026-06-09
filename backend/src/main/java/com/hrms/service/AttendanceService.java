package com.hrms.service;

import com.hrms.entity.Attendance;
import com.hrms.entity.Attendance.AttendanceStatus;
import com.hrms.entity.User;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepo;
    private final UserRepository userRepo;

    @Transactional
    public Attendance clockIn(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();
        Attendance existing = attendanceRepo.findByUserIdAndDate(userId, today).orElse(null);
        if (existing != null && existing.getClockInTime() != null && existing.getClockOutTime() == null)
            throw new RuntimeException("Already clocked in today");

        LocalDateTime now = LocalDateTime.now();
        Attendance attendance = Attendance.builder()
            .user(user)
            .date(today)
            .clockInTime(now)
            .status(getStatus(now))
            .build();
        return attendanceRepo.save(attendance);
    }

    @Transactional
    public Attendance clockOut(Long userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepo.findByUserIdAndDate(userId, today)
            .orElseThrow(() -> new RuntimeException("No clock-in found for today"));
        if (attendance.getClockOutTime() != null)
            throw new RuntimeException("Already clocked out today");

        LocalDateTime now = LocalDateTime.now();
        attendance.setClockOutTime(now);
        double hours = ChronoUnit.MINUTES.between(attendance.getClockInTime(), now) / 60.0;
        attendance.setHoursWorked(Math.round(hours * 100.0) / 100.0);
        double ot = Math.max(0, hours - 8.0);
        attendance.setOvertimeHours(Math.round(ot * 100.0) / 100.0);
        return attendanceRepo.save(attendance);
    }

    public Attendance findByUserAndDate(Long userId, LocalDate date) {
        return attendanceRepo.findByUserIdAndDate(userId, date).orElse(null);
    }

    private AttendanceStatus getStatus(LocalDateTime clockIn) {
        return clockIn.getHour() > 9 || (clockIn.getHour() == 9 && clockIn.getMinute() > 15)
            ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    }
}
