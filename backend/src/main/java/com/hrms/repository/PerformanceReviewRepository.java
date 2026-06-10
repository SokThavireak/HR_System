package com.hrms.repository;

import com.hrms.entity.PerformanceReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
    Page<PerformanceReview> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId, Pageable pageable);
    Page<PerformanceReview> findByEmployee_EmployeeIdOrderByCreatedAtDesc(String employeeId, Pageable pageable);
    Page<PerformanceReview> findAllByOrderByCreatedAtDesc(Pageable pageable);
    boolean existsByEmployeeIdAndReviewPeriodStartAndReviewPeriodEnd(Long employeeId, java.time.LocalDate start, java.time.LocalDate end);
}
