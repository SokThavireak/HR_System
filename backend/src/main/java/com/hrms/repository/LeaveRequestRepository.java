package com.hrms.repository;

import com.hrms.entity.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus status, Pageable pageable);
    long countByStatus(LeaveRequest.LeaveStatus status);

    @Query("SELECT COALESCE(SUM(l.totalDays), 0) FROM LeaveRequest l WHERE l.user.id = :userId AND l.leaveType = :type AND l.status = 'APPROVED' AND l.startDate <= :end AND l.endDate >= :start")
    long countByUserAndTypeAndDateRange(
        @Param("userId") Long userId,
        @Param("type") LeaveRequest.LeaveType type,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}
