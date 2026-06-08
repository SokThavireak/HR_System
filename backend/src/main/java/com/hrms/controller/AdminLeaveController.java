package com.hrms.controller;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.LeaveRequest.LeaveStatus;
import com.hrms.entity.User;
import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/leaves")
@RequiredArgsConstructor
public class AdminLeaveController {

    private final LeaveService leaveService;
    private final UserRepository userRepo;

    @GetMapping
    public Page<LeaveRequest> getLeaves(@RequestParam(defaultValue = "PENDING") LeaveStatus status,
                                         @RequestParam(defaultValue = "0") int page) {
        return leaveService.getByStatus(status, PageRequest.of(page, 10));
    }

    @PutMapping("/{id}/approve")
    public LeaveRequest approve(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Long approverId = userRepo.findByEmail(ud.getUsername()).orElseThrow().getId();
        return leaveService.approve(id, approverId);
    }

    @PutMapping("/{id}/reject")
    public LeaveRequest reject(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud,
                                @RequestBody RejectRequest req) {
        Long rejecterId = userRepo.findByEmail(ud.getUsername()).orElseThrow().getId();
        return leaveService.reject(id, rejecterId, req.getRejectionReason());
    }

    @PutMapping("/{id}/cancel")
    public LeaveRequest cancel(@PathVariable Long id) {
        return leaveService.cancel(id);
    }

    @PutMapping("/{id}")
    public LeaveRequest update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        return leaveService.updateLeave(id, req.getLeaveType(), req.getStartDate(), req.getEndDate(), req.getReason());
    }

    @GetMapping("/balance/{userId}")
    public java.util.Map<String, Object> getLeaveBalance(@PathVariable Long userId) {
        return leaveService.getLeaveBalance(userId);
    }

    @PutMapping("/balance/{userId}")
    public User updateLeaveBalance(@PathVariable Long userId, @RequestBody BalanceUpdateRequest req) {
        return leaveService.updateLeaveBalance(userId, req.getIlLeaveEntitlement(), req.getSickLeaveEntitlement(), req.getSpecialLeaveEntitlement());
    }

    @lombok.Data
    public static class RejectRequest {
        private String rejectionReason;
    }

    @lombok.Data
    public static class UpdateRequest {
        private LeaveRequest.LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }

    @lombok.Data
    public static class BalanceUpdateRequest {
        private Integer ilLeaveEntitlement;
        private Integer sickLeaveEntitlement;
        private Integer specialLeaveEntitlement;
    }
}
