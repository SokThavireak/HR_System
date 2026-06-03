package com.hrms.service;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.LeaveRequest.LeaveStatus;
import com.hrms.entity.User;
import com.hrms.repository.LeaveRequestRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepo;

    @Transactional
    public LeaveRequest requestLeave(Long userId, LeaveRequest.LeaveType type, LocalDate start, LocalDate end, String reason) {
        if (start.isAfter(end)) throw new RuntimeException("Start date must be before end date");
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        int days = (int) ChronoUnit.DAYS.between(start, end) + 1;
        LeaveRequest leave = LeaveRequest.builder()
            .user(user).leaveType(type).startDate(start).endDate(end)
            .totalDays(days).reason(reason).status(LeaveStatus.PENDING)
            .build();
        return leaveRepo.save(leave);
    }

    public List<LeaveRequest> getMyLeaves(Long userId) {
        return leaveRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Page<LeaveRequest> getPending(Pageable page) {
        return leaveRepo.findByStatusOrderByCreatedAtDesc(LeaveStatus.PENDING, page);
    }

    @Transactional
    public LeaveRequest approve(Long leaveId, Long approverId) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(userRepo.findById(approverId).orElseThrow());
        leave.setApprovedAt(java.time.LocalDateTime.now());
        return leaveRepo.save(leave);
    }

    @Transactional
    public LeaveRequest reject(Long leaveId, Long rejecterId, String reason) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(userRepo.findById(rejecterId).orElseThrow());
        leave.setApprovedAt(java.time.LocalDateTime.now());
        leave.setRejectionReason(reason);
        return leaveRepo.save(leave);
    }

    @Transactional
    public LeaveRequest cancel(Long leaveId) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(LeaveStatus.CANCELLED);
        return leaveRepo.save(leave);
    }

    public long countPending() { return leaveRepo.countByStatus(LeaveStatus.PENDING); }
}
