package com.hrms.controller;

import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.repository.RoleRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    @GetMapping
    public ResponseEntity<Page<User>> getUsers(@RequestParam(required = false) String search, Pageable page) {
        if (search == null || search.isBlank())
            return ResponseEntity.ok(userRepo.findAll(page));
        return ResponseEntity.ok(userRepo
            .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, search, page));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already exists");
        if (req.getEmployeeId() != null && !req.getEmployeeId().isBlank()
                && userRepo.findByEmployeeId(req.getEmployeeId()).isPresent())
            throw new RuntimeException("Employee ID already exists");
        Role role = roleRepo.findByName(Role.RoleName.valueOf(req.getRole())).orElseThrow();
        User user = User.builder()
            .employeeId(req.getEmployeeId())
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phone(req.getPhone())
            .department(req.getDepartment())
            .position(req.getPosition())
            .baseSalary(req.getBaseSalary() != null ? new BigDecimal(req.getBaseSalary()) : null)
            .workHoursPerDay(req.getWorkHoursPerDay())
            .workingDaysPerMonth(req.getWorkingDaysPerMonth())
            .workStartTime(req.getWorkStartTime())
            .hireDate(req.getHireDate())
            .active(true)
            .build();
        user.getRoles().add(role);
        return ResponseEntity.ok(userRepo.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepo.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody CreateUserRequest req) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhone(req.getPhone());
        user.setDepartment(req.getDepartment());
        user.setPosition(req.getPosition());
        if (req.getBaseSalary() != null) user.setBaseSalary(new BigDecimal(req.getBaseSalary()));
        if (req.getWorkHoursPerDay() != null) user.setWorkHoursPerDay(req.getWorkHoursPerDay());
        if (req.getWorkingDaysPerMonth() != null) user.setWorkingDaysPerMonth(req.getWorkingDaysPerMonth());
        if (req.getWorkStartTime() != null) user.setWorkStartTime(req.getWorkStartTime());
        if (req.getHireDate() != null) user.setHireDate(req.getHireDate());
        if (req.getIlLeaveEntitlement() != null) user.setIlLeaveEntitlement(req.getIlLeaveEntitlement());
        if (req.getSickLeaveEntitlement() != null) user.setSickLeaveEntitlement(req.getSickLeaveEntitlement());
        if (req.getSpecialLeaveEntitlement() != null) user.setSpecialLeaveEntitlement(req.getSpecialLeaveEntitlement());
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody RoleRequest req) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepo.findByName(Role.RoleName.valueOf(req.getRole())).orElseThrow();
        user.getRoles().clear();
        user.getRoles().add(role);
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id, @RequestBody ResetPwdRequest req) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(encoder.encode(req.getNewPassword()));
        userRepo.save(user);
        return ResponseEntity.ok().build();
    }

    @lombok.Data
    public static class RoleRequest { private String role; }

    @lombok.Data
    public static class ResetPwdRequest { private String newPassword; }

    @lombok.Data
    public static class CreateUserRequest {
        private String employeeId;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phone;
        private String department;
        private String position;
        private String baseSalary;
        private Double workHoursPerDay;
        private Integer workingDaysPerMonth;
        private java.time.LocalTime workStartTime;
        private java.time.LocalDate hireDate;
        private String role;
        private Integer ilLeaveEntitlement;
        private Integer sickLeaveEntitlement;
        private Integer specialLeaveEntitlement;
    }
}
