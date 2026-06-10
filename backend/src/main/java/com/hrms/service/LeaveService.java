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

    public int getLeaveUsedThisYear(Long userId, LeaveType type) {
        LocalDate startOfYear = LocalDate.now().withDayOfYear(1);
        LocalDate endOfYear = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
        return (int) leaveRepo.countByUserAndTypeAndDateRange(userId, type, startOfYear, endOfYear);
    }

    @Transactional
    public LeaveRequest requestLeave(Long userId, LeaveType type, LocalDate start, LocalDate end, String reason) {
        if (start.isAfter(end)) throw new RuntimeException("Start date must be before end date");
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        int days = (int) ChronoUnit.DAYS.between(start, end) + 1;

        // Validate balance
        if (type == LeaveType.IL) {
            int remaining = user.getIlLeaveEntitlement() - getLeaveUsedThisYear(userId, LeaveType.IL);
            if (days > remaining)
                throw new RuntimeException("Insufficient IL balance. Remaining: " + remaining + " days");
        } else if (type == LeaveType.SICK) {
            int remaining = user.getSickLeaveEntitlement() - getLeaveUsedThisYear(userId, LeaveType.SICK);
            if (days > remaining)
                throw new RuntimeException("Insufficient sick leave balance. Remaining: " + remaining + " days");
        } else if (type == LeaveType.SPECIAL) {
            int remaining = user.getSpecialLeaveEntitlement() - getLeaveUsedThisYear(userId, LeaveType.SPECIAL);
            if (days > remaining)
                throw new RuntimeException("Insufficient special leave balance. Remaining: " + remaining + " days");
        }

        LeaveRequest leave = LeaveRequest.builder()
            .user(user).leaveType(type).startDate(start).endDate(end)
            .totalDays(days).reason(reason).status(LeaveStatus.PENDING)
            .build();
        return leaveRepo.save(leave);
    }

    public LeaveRequest getById(Long id) {
        return leaveRepo.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));
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
            int remaining = user.getIlLeaveEntitlement() - getLeaveUsedThisYear(user.getId(), LeaveType.IL);
            if (days > remaining)
                throw new RuntimeException("Insufficient IL balance. Remaining: " + remaining + " days");
        } else if (leave.getLeaveType() == LeaveType.SICK) {
            int remaining = user.getSickLeaveEntitlement() - getLeaveUsedThisYear(user.getId(), LeaveType.SICK);
            if (days > remaining)
                throw new RuntimeException("Insufficient sick leave balance. Remaining: " + remaining + " days");
        } else if (leave.getLeaveType() == LeaveType.SPECIAL) {
            int remaining = user.getSpecialLeaveEntitlement() - getLeaveUsedThisYear(user.getId(), LeaveType.SPECIAL);
            if (days > remaining)
                throw new RuntimeException("Insufficient special leave balance. Remaining: " + remaining + " days");
        }

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
    public long countPendingByUser(Long userId) { return leaveRepo.countByUserIdAndStatus(userId, LeaveStatus.PENDING); }

    public Map<String, Object> getLeaveBalance(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        int ilUsed = getLeaveUsedThisYear(userId, LeaveType.IL);
        int sickUsed = getLeaveUsedThisYear(userId, LeaveType.SICK);
        int specialUsed = getLeaveUsedThisYear(userId, LeaveType.SPECIAL);

        Map<String, Object> balance = new HashMap<>();
        balance.put("ilEntitlement", user.getIlLeaveEntitlement());
        balance.put("ilUsed", ilUsed);
        balance.put("ilRemaining", user.getIlLeaveEntitlement() - ilUsed);
        balance.put("sickEntitlement", user.getSickLeaveEntitlement());
        balance.put("sickUsed", sickUsed);
        balance.put("sickRemaining", user.getSickLeaveEntitlement() - sickUsed);
        balance.put("specialEntitlement", user.getSpecialLeaveEntitlement());
        balance.put("specialUsed", specialUsed);
        balance.put("specialRemaining", user.getSpecialLeaveEntitlement() - specialUsed);
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
