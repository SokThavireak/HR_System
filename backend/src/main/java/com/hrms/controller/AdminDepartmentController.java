package com.hrms.controller;

import com.hrms.entity.Department;
import com.hrms.entity.User;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import com.hrms.service.ActivityLogService;

@RestController
@RequestMapping("/api/v1/admin/departments")
@RequiredArgsConstructor
public class AdminDepartmentController {

    private final DepartmentRepository deptRepo;
    private final UserRepository userRepo;
    private final ActivityLogService activityLogService;

    @GetMapping
    public Page<Department> getAll(@RequestParam(required = false) String search, Pageable page) {
        if (search != null && !search.isBlank())
            return deptRepo.findByNameContainingIgnoreCase(search, page);
        return deptRepo.findAll(page);
    }

    @GetMapping("/list")
    public java.util.List<Department> listAll() {
        return deptRepo.findAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Long id) {
        return deptRepo.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @PostMapping
    public Department create(@RequestBody DepartmentRequest req) {
        if (deptRepo.existsByName(req.getName()))
            throw new RuntimeException("Department already exists");
        Department dept = Department.builder()
            .name(req.getName())
            .description(req.getDescription())
            .build();
        if (req.getHeadUserId() != null) {
            User head = userRepo.findById(req.getHeadUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            dept.setHead(head);
        }
        Department saved = deptRepo.save(dept);
        activityLogService.log("Department " + saved.getName() + " created", "DEPARTMENT");
        return saved;
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @RequestBody DepartmentRequest req) {
        Department dept = deptRepo.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        if (req.getName() != null) dept.setName(req.getName());
        if (req.getDescription() != null) dept.setDescription(req.getDescription());
        if (req.getHeadUserId() != null) {
            User head = userRepo.findById(req.getHeadUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            dept.setHead(head);
        }
        Department saved = deptRepo.save(dept);
        activityLogService.log("Department " + saved.getName() + " updated", "DEPARTMENT");
        return saved;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Department dept = deptRepo.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        deptRepo.deleteById(id);
        activityLogService.log("Department " + dept.getName() + " deleted", "DEPARTMENT");
    }

    @lombok.Data
    public static class DepartmentRequest {
        private String name;
        private String description;
        private Long headUserId;
    }
}
