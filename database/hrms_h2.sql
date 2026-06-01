/*
 * ================================================================
 * HRMS — H2 Database Import Script
 *
 * Create database first, then run this script.
 *
 * Usage:
 *   1. Start the backend (Spring Boot) — it auto-creates the
 *      schema via Hibernate DDL (create-drop) and seeds data
 *      via DataSeeder.
 *
 *   2. If you want to import manually into a fresh H2 database:
 *      - Connect to H2 console (http://localhost:8080/h2-console)
 *      - JDBC URL: jdbc:h2:mem:hrmsdb
 *      - Run this script
 *
 * Default login credentials (from DataSeeder):
 *   Admin:  admin@hrms.com  / admin123
 *   Employee: john@hrms.com / john123
 *   Employee: jane@hrms.com / jane123
 * ================================================================
 */

/* ── ROLES ───────────────────────────────────────────────────── */
INSERT INTO roles (name, description) VALUES
    ('ROLE_HR_ADMIN', 'HR Administrator'),
    ('ROLE_EMPLOYEE', 'Employee');

/* ── USERS ───────────────────────────────────────────────────── */
-- Passwords are BCrypt-encoded 'admin123', 'john123', 'jane123'
INSERT INTO users (email, password, first_name, last_name, phone, department, position, base_salary, hire_date, active, created_at, updated_at) VALUES
    ('admin@hrms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah', 'Johnson', '+1-555-0100', 'Human Resources', 'HR Director', 8500.00, '2022-01-15', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('john@hrms.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe',      '+1-555-0101', 'Engineering', 'Software Engineer', 5500.00, '2023-03-01', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('jane@hrms.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith',    '+1-555-0102', 'Marketing', 'Marketing Manager', 6000.00, '2023-06-15', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/* ── USER ROLES ──────────────────────────────────────────────── */
INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 1),  -- admin → ROLE_HR_ADMIN
    (2, 2),  -- john  → ROLE_EMPLOYEE
    (3, 2);  -- jane  → ROLE_EMPLOYEE

/* ── LEAVE REQUESTS ──────────────────────────────────────────── */
INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason, status, created_at, updated_at) VALUES
    (2, 'ANNUAL',   CURRENT_DATE + 5,  CURRENT_DATE + 10, 6, 'Family vacation',  'PENDING',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'SICK',     CURRENT_DATE + 1,  CURRENT_DATE + 2,  2, 'Flu recovery',     'PENDING',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'ANNUAL',   CURRENT_DATE - 20, CURRENT_DATE - 15, 6, 'Trip to mountains','APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Set approved_by for the approved leave
UPDATE leave_requests SET approved_by = 1, approved_at = CURRENT_TIMESTAMP - 22 WHERE id = 3;

/* ── PAYROLL ─────────────────────────────────────────────────── */
INSERT INTO payroll (user_id, pay_period_start, pay_period_end, base_salary, overtime_rate, overtime_hours, overtime_pay, extra_salary, tax_deduction, insurance_deduction, other_deductions, gross_salary, total_deductions, net_salary, status) VALUES
    (2, DATE_TRUNC('MONTH', CURRENT_DATE), DATE_TRUNC('MONTH', CURRENT_DATE) + 1 MONTH - 1 DAY, 5500.00, 25.00, 8.0, 200.00, 300.00, 825.00, 250.00, 0.00, 6000.00, 1075.00, 4925.00, 'DRAFT'),
    (3, DATE_TRUNC('MONTH', CURRENT_DATE), DATE_TRUNC('MONTH', CURRENT_DATE) + 1 MONTH - 1 DAY, 6000.00, 30.00, 4.0, 120.00,   0.00, 918.00, 280.00, 0.00, 6120.00, 1198.00, 4922.00, 'DRAFT'),
    (2, DATE_TRUNC('MONTH', CURRENT_DATE) - 1 MONTH, DATE_TRUNC('MONTH', CURRENT_DATE) - 1 DAY, 5500.00, 25.00, 5.0, 125.00, 200.00, 788.00, 250.00, 0.00, 5825.00, 1038.00, 4787.00, 'PAID');

/* ── PERFORMANCE REVIEWS ─────────────────────────────────────── */
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, quality_score, productivity_score, communication_score, teamwork_score, punctuality_score, overall_score, feedback, goals, improvements, created_at, updated_at) VALUES
    (2, 1, '2024-01-01', '2024-06-30', 4, 5, 4, 4, 5, 4.4, 'Excellent work this quarter. Great contributions to the backend redesign.', 'Lead the Q3 microservices migration', 'Improve documentation skills', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 1, '2024-01-01', '2024-06-30', 5, 4, 5, 5, 4, 4.6, 'Outstanding leadership on the summer campaign.', 'Expand team to 3 junior marketers', 'Explore AI-driven analytics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/* ── ATTENDANCE ──────────────────────────────────────────────── */
INSERT INTO attendance (user_id, date, clock_in_time, status) VALUES
    (2, CURRENT_DATE, CURRENT_TIMESTAMP - 8 HOUR, 'PRESENT'),
    (3, CURRENT_DATE, CURRENT_TIMESTAMP - 7 HOUR, 'LATE');
