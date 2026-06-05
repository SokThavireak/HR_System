package com.hrms.repository;

import com.hrms.entity.Position;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    Page<Position> findByDepartmentId(Long departmentId, Pageable pageable);
    List<Position> findByDepartmentId(Long departmentId);
    boolean existsByTitleAndDepartmentId(String title, Long departmentId);
}
