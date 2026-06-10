package com.hrms.controller;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.User;
import com.hrms.repository.UserRepository;
import com.hrms.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import com.hrms.service.ActivityLogService;

@RestController
@RequestMapping("/api/v1/employee/leaves")
@RequiredArgsConstructor
public class EmployeeLeaveController {

    private final LeaveService leaveService;
    private final UserRepository userRepo;
    private final ActivityLogService activityLogService;

    private User currentUser(UserDetails ud) {
        return userRepo.findByEmail(ud.getUsername()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(leaveService.getMyLeaves(currentUser(ud).getId()));
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> requestLeave(@AuthenticationPrincipal UserDetails ud,
                                                     @RequestBody LeaveRequestDto dto) {
        User u = currentUser(ud);
        LeaveRequest req = leaveService.requestLeave(
            u.getId(), dto.getLeaveType(), dto.getStartDate(), dto.getEndDate(), dto.getReason());
        activityLogService.log("New leave request from " + u.getFirstName() + " " + u.getLastName(), "LEAVE_REQUEST");
        return ResponseEntity.ok(req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelLeave(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @lombok.Data
    public static class LeaveRequestDto {
        private LeaveRequest.LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }
}
