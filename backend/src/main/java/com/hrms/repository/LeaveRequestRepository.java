package com.hrms.repository;

import com.hrms.entity.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus status, Pageable pageable);
    long countByStatus(LeaveRequest.LeaveStatus status);
}
