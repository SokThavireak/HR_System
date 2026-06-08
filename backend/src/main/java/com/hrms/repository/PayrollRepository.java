package com.hrms.repository;

import com.hrms.entity.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    @Query("SELECT p FROM Payroll p JOIN FETCH p.user ORDER BY p.payPeriodEnd DESC")
    Page<Payroll> findAllByOrderByPayPeriodEndDesc(Pageable pageable);

    @Query("SELECT p FROM Payroll p JOIN FETCH p.user WHERE p.user.id = :userId ORDER BY p.payPeriodEnd DESC")
    List<Payroll> findByUserIdOrderByPayPeriodEndDesc(@Param("userId") Long userId);

    @Query("SELECT p FROM Payroll p JOIN FETCH p.user WHERE p.user.id = :userId AND p.payPeriodStart = :start AND p.payPeriodEnd = :end")
    Optional<Payroll> findByUserIdAndPayPeriodStartAndPayPeriodEnd(@Param("userId") Long userId, @Param("start") java.time.LocalDate start, @Param("end") java.time.LocalDate end);

    @Query("SELECT p FROM Payroll p JOIN FETCH p.user WHERE p.status = :status")
    List<Payroll> findAllByStatus(@Param("status") Payroll.PayrollStatus status);

    @Query("SELECT p FROM Payroll p JOIN FETCH p.user WHERE p.id = :id")
    Optional<Payroll> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(p.netSalary), 0) FROM Payroll p WHERE p.status = 'PAID'")
    java.math.BigDecimal sumPaidNet();
}
