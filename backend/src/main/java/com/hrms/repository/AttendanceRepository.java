package com.hrms.repository;

import com.hrms.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserIdAndDate(Long userId, LocalDate date);
    List<Attendance> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to);

    Page<Attendance> findByDateBetween(LocalDate from, LocalDate to, Pageable pageable);

    @Query("SELECT COALESCE(SUM(a.overtimeHours), 0) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :from AND :to")
    Double sumOvertimeByUserAndPeriod(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.status = 'PRESENT' AND a.date BETWEEN :from AND :to")
    Long countPresentDays(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(a.hoursWorked), 0) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :from AND :to")
    Double sumHoursWorked(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(a.lateMinutes), 0) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :from AND :to AND a.status <> 'ON_LEAVE'")
    Integer sumLateMinutesExcludingLeave(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :from AND :to AND a.lateMinutes > 0 AND a.status <> 'ON_LEAVE'")
    Long countLateDaysExcludingLeave(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);
}
