package com.hrms.controller;

import com.hrms.entity.Department;
import com.hrms.entity.Position;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/positions")
@RequiredArgsConstructor
public class AdminPositionController {

    private final PositionRepository posRepo;
    private final DepartmentRepository deptRepo;

    @GetMapping
    public Page<Position> getAll(@RequestParam(required = false) Long departmentId, Pageable page) {
        if (departmentId != null)
            return posRepo.findByDepartmentId(departmentId, page);
        return posRepo.findAll(page);
    }

    @GetMapping("/list")
    public java.util.List<Position> listAll(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null)
            return posRepo.findByDepartmentId(departmentId);
        return posRepo.findAll();
    }

    @GetMapping("/{id}")
    public Position getById(@PathVariable Long id) {
        return posRepo.findById(id).orElseThrow(() -> new RuntimeException("Position not found"));
    }

    @PostMapping
    public Position create(@RequestBody PositionRequest req) {
        Department dept = deptRepo.findById(req.getDepartmentId())
            .orElseThrow(() -> new RuntimeException("Department not found"));
        if (posRepo.existsByTitleAndDepartmentId(req.getTitle(), req.getDepartmentId()))
            throw new RuntimeException("Position already exists in this department");
        Position pos = Position.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .department(dept)
            .minSalary(req.getMinSalary() != null ? new BigDecimal(req.getMinSalary()) : null)
            .maxSalary(req.getMaxSalary() != null ? new BigDecimal(req.getMaxSalary()) : null)
            .build();
        return posRepo.save(pos);
    }

    @PutMapping("/{id}")
    public Position update(@PathVariable Long id, @RequestBody PositionRequest req) {
        Position pos = posRepo.findById(id).orElseThrow(() -> new RuntimeException("Position not found"));
        if (req.getTitle() != null) pos.setTitle(req.getTitle());
        if (req.getDescription() != null) pos.setDescription(req.getDescription());
        if (req.getDepartmentId() != null) {
            Department dept = deptRepo.findById(req.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
            pos.setDepartment(dept);
        }
        if (req.getMinSalary() != null) pos.setMinSalary(new BigDecimal(req.getMinSalary()));
        if (req.getMaxSalary() != null) pos.setMaxSalary(new BigDecimal(req.getMaxSalary()));
        return posRepo.save(pos);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        posRepo.deleteById(id);
    }

    @lombok.Data
    public static class PositionRequest {
        private String title;
        private String description;
        private Long departmentId;
        private String minSalary;
        private String maxSalary;
    }
}
