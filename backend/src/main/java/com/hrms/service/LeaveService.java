package com.hrms.service;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.LeaveRequest.LeaveStatus;
import com.hrms.entity.LeaveRequest.LeaveType;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepo;

    @Transactional
    public LeaveRequest requestLeave(Long userId, LeaveType type, LocalDate start, LocalDate end, String reason) {
        if (start.isAfter(end)) throw new RuntimeException("Start date must be before end date");
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        int days = (int) ChronoUnit.DAYS.between(start, end) + 1;

        // Validate balance
        if (type == LeaveType.IL) {
            int remaining = user.getIlLeaveEntitlement() - user.getIlLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient IL balance. Remaining: " + remaining + " days");
        } else if (type == LeaveType.SICK) {
            int remaining = user.getSickLeaveEntitlement() - user.getSickLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient sick leave balance. Remaining: " + remaining + " days");
        } else if (type == LeaveType.SPECIAL) {
            int remaining = user.getSpecialLeaveEntitlement() - user.getSpecialLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient special leave balance. Remaining: " + remaining + " days");
        }

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

    public Page<LeaveRequest> getByStatus(LeaveStatus status, Pageable page) {
        return leaveRepo.findByStatusOrderByCreatedAtDesc(status, page);
    }

    @Transactional
    public LeaveRequest approve(Long leaveId, Long approverId) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        User user = leave.getUser();
        int days = leave.getTotalDays();

        // Deduct balance
        if (leave.getLeaveType() == LeaveType.IL) {
            int remaining = user.getIlLeaveEntitlement() - user.getIlLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient IL balance. Remaining: " + remaining + " days");
            user.setIlLeaveUsed(user.getIlLeaveUsed() + days);
        } else if (leave.getLeaveType() == LeaveType.SICK) {
            int remaining = user.getSickLeaveEntitlement() - user.getSickLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient sick leave balance. Remaining: " + remaining + " days");
            user.setSickLeaveUsed(user.getSickLeaveUsed() + days);
        } else if (leave.getLeaveType() == LeaveType.SPECIAL) {
            int remaining = user.getSpecialLeaveEntitlement() - user.getSpecialLeaveUsed();
            if (days > remaining)
                throw new RuntimeException("Insufficient special leave balance. Remaining: " + remaining + " days");
            user.setSpecialLeaveUsed(user.getSpecialLeaveUsed() + days);
        }
        userRepo.save(user);

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
        // If cancelling an approved leave, restore balance
        if (leave.getStatus() == LeaveStatus.APPROVED) {
            User user = leave.getUser();
            int days = leave.getTotalDays();
            if (leave.getLeaveType() == LeaveType.IL) {
                user.setIlLeaveUsed(Math.max(0, user.getIlLeaveUsed() - days));
            } else if (leave.getLeaveType() == LeaveType.SICK) {
                user.setSickLeaveUsed(Math.max(0, user.getSickLeaveUsed() - days));
            } else if (leave.getLeaveType() == LeaveType.SPECIAL) {
                user.setSpecialLeaveUsed(Math.max(0, user.getSpecialLeaveUsed() - days));
            }
            userRepo.save(user);
        }
        leave.setStatus(LeaveStatus.CANCELLED);
        return leaveRepo.save(leave);
    }

    @Transactional
    public LeaveRequest updateLeave(Long leaveId, LeaveType type, LocalDate start, LocalDate end, String reason) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (start.isAfter(end)) throw new RuntimeException("Start date must be before end date");
        int days = (int) ChronoUnit.DAYS.between(start, end) + 1;
        leave.setLeaveType(type);
        leave.setStartDate(start);
        leave.setEndDate(end);
        leave.setTotalDays(days);
        leave.setReason(reason);
        return leaveRepo.save(leave);
    }

    public long countPending() { return leaveRepo.countByStatus(LeaveStatus.PENDING); }

    public Map<String, Object> getLeaveBalance(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> balance = new HashMap<>();
        balance.put("ilEntitlement", user.getIlLeaveEntitlement());
        balance.put("ilUsed", user.getIlLeaveUsed());
        balance.put("ilRemaining", user.getIlLeaveEntitlement() - user.getIlLeaveUsed());
        balance.put("sickEntitlement", user.getSickLeaveEntitlement());
        balance.put("sickUsed", user.getSickLeaveUsed());
        balance.put("sickRemaining", user.getSickLeaveEntitlement() - user.getSickLeaveUsed());
        balance.put("specialEntitlement", user.getSpecialLeaveEntitlement());
        balance.put("specialUsed", user.getSpecialLeaveUsed());
        balance.put("specialRemaining", user.getSpecialLeaveEntitlement() - user.getSpecialLeaveUsed());
        balance.put("unusedIlPaid", user.getUnusedIlPaid());
        return balance;
    }

    @Transactional
    public User updateLeaveBalance(Long userId, Integer ilEntitlement, Integer sickEntitlement, Integer specialEntitlement) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (ilEntitlement != null) user.setIlLeaveEntitlement(ilEntitlement);
        if (sickEntitlement != null) user.setSickLeaveEntitlement(sickEntitlement);
        if (specialEntitlement != null) user.setSpecialLeaveEntitlement(specialEntitlement);
        return userRepo.save(user);
    }
}
