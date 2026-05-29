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
    public ResponseEntity<Page<User>> getUsers(@RequestParam(defaultValue) String search, Pageable page) {
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
        Role role = roleRepo.findByName(Role.RoleName.valueOf(req.getRole())).orElseThrow();
        User user = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phone(req.getPhone())
            .department(req.getDepartment())
            .position(req.getPosition())
            .baseSalary(req.getBaseSalary() != null ? new BigDecimal(req.getBaseSalary()) : null)
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

    @lombok.Data
    public static class CreateUserRequest {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phone;
        private String department;
        private String position;
        private String baseSalary;
        private java.time.LocalDate hireDate;
        private String role;
    }
}
