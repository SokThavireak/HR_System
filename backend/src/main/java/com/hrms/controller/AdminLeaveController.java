package com.hrms.controller;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.LeaveRequest.LeaveStatus;
import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/leaves")
@RequiredArgsConstructor
public class AdminLeaveController {

    private final LeaveService leaveService;
    private final UserRepository userRepo;

    @GetMapping
    public Page<LeaveRequest> getLeaves(@RequestParam(defaultValue = "PENDING") LeaveStatus status,
                                         @RequestParam(defaultValue = "0") int page) {
        return leaveService.getPending(PageRequest.of(page, 10));
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

    @lombok.Data
    public static class RejectRequest {
        private String rejectionReason;
    }
}
