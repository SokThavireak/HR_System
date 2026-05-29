package com.hrms.repository;

import com.hrms.entity.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByUserIdOrderByPayPeriodEndDesc(Long userId);
    Optional<Payroll> findByUserIdAndPayPeriodStartAndPayPeriodEnd(Long userId, java.time.LocalDate start, java.time.LocalDate end);
    Page<Payroll> findAllByOrderByPayPeriodEndDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.netSalary), 0) FROM Payroll p WHERE p.status = 'PAID'")
    java.math.BigDecimal sumPaidNet();
}
