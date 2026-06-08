package com.hrms.repository;

import com.hrms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByActiveTrue();
    Page<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String first, String last, String email, Pageable pageable);

    @Query("SELECT MAX(u.employeeId) FROM User u WHERE u.employeeId IS NOT NULL")
    String findMaxEmployeeId();

    @Query("SELECT u FROM User u WHERE u.employeeId = :employeeId")
    Optional<User> findByEmployeeId(String employeeId);

    @Query("SELECT u.department as department, COUNT(u) as count FROM User u WHERE u.active = true AND u.department IS NOT NULL GROUP BY u.department ORDER BY count DESC")
    List<DeptCount> countByDepartment();

    interface DeptCount {
        String getDepartment();
        Long getCount();
    }
}
