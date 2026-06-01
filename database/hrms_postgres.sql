/*
 * ================================================================
 * HRMS — PostgreSQL Seed Data Script
 * Database: hr_system
 *
 * PREREQUISITE: Start the Spring Boot backend first so Hibernate
 * creates the tables automatically (ddl-auto: update), then run
 * this script to insert seed data.
 *
 * Import:
 *   psql -U postgres -d hr_system -f hrms_postgres.sql
 *
 * Default login:
 *   Admin:    admin@hrms.local  / changeme
 *   Employee: jane@hrms.local   / changeme
 *   Employee: john@hrms.local   / changeme
 * ================================================================
 */

/* ── SEED DATA ──────────────────────────────────────────────── */

-- Roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_EMPLOYEE',  'Standard employee'),
    ('ROLE_HR_ADMIN',  'HR administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Users (password = 'changeme' bcrypt hash for all)
INSERT INTO users (email, password, first_name, last_name, phone, department, position, base_salary, hire_date, active) VALUES
    ('admin@hrms.local',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin',   'System',  '+1-000-000-0000', 'HR',        'HR Administrator', 90000, '2024-01-01', TRUE),
    ('jane@hrms.local',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane',    'Doe',     '+1-111-111-1111', 'Engineering', 'Software Engineer', 75000, '2024-03-15', TRUE),
    ('john@hrms.local',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John',    'Smith',   '+1-222-222-2222', 'Marketing',    'Marketing Lead',   68000, '2024-06-01', TRUE),
    ('alice@hrms.local',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice',   'Nguyen',  '+1-333-333-3333', 'Finance',      'Accountant',       62000, '2024-08-10', TRUE),
    ('bob@hrms.local',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob',     'Kim',     '+1-444-444-4444', 'Engineering', 'QA Engineer',      70000, '2025-01-20', TRUE);

-- User roles
INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 2),  -- admin → ROLE_HR_ADMIN
    (2, 1),  -- jane  → ROLE_EMPLOYEE
    (3, 1),  -- john  → ROLE_EMPLOYEE
    (4, 1),  -- alice → ROLE_EMPLOYEE
    (5, 1);  -- bob   → ROLE_EMPLOYEE

-- Attendance (last 5 days)
INSERT INTO attendance (user_id, date, clock_in_time, clock_out_time, hours_worked, status) VALUES
    (2, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT'),
    (2, CURRENT_DATE - 3, now() - interval '3 days 9 hours',  now() - interval '3 days 1 hour',  8.0, 'PRESENT'),
    (2, CURRENT_DATE - 2, now() - interval '2 days 9 hours',  now() - interval '2 days 1 hour',  8.0, 'PRESENT'),
    (2, CURRENT_DATE - 1, now() - interval '1 days 9 hours',  now() - interval '1 days 1 hour',  8.0, 'LATE'),
    (3, CURRENT_DATE - 4, now() - interval '4 days 8 hours',  now() - interval '4 days 0 hours', 8.0, 'PRESENT'),
    (3, CURRENT_DATE - 3, now() - interval '3 days 8 hours',  now() - interval '3 days 0 hours', 8.0, 'PRESENT'),
    (3, CURRENT_DATE - 2, NULL,                                    NULL,                            NULL, 'ABSENT'),
    (4, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT'),
    (4, CURRENT_DATE - 3, now() - interval '3 days 9 hours',  now() - interval '3 days 1 hour',  8.0, 'PRESENT'),
    (5, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT');

-- Leave requests
INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason, status) VALUES
    (2, 'ANNUAL',    CURRENT_DATE + 10, CURRENT_DATE + 14, 5, 'Family vacation',  'PENDING'),
    (3, 'SICK',      CURRENT_DATE - 2,  CURRENT_DATE,      3, 'Flu',              'APPROVED'),
    (4, 'EMERGENCY', CURRENT_DATE + 3,  CURRENT_DATE + 3,  1, 'Family emergency', 'PENDING'),
    (5, 'ANNUAL',    CURRENT_DATE + 20, CURRENT_DATE + 25, 6, 'Travel to hometown', 'PENDING');

-- Payroll
INSERT INTO payroll (user_id, pay_period_start, pay_period_end, base_salary, extra_salary, overtime_hours, overtime_rate, overtime_pay, gross_salary, tax_deduction, insurance_deduction, other_deductions, total_deductions, net_salary, status) VALUES
    (2, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 6250, 500, 10, 30, 300, 7050, 1200, 350, 100, 1650, 5400, 'PAID'),
    (3, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5667, 200,  5, 25, 125, 5992, 1000, 300,  50, 1350, 4642, 'PROCESSED'),
    (4, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5167,   0,  0,  0,   0, 5167,  800, 250,   0, 1050, 4117, 'DRAFT'),
    (5, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5833, 300,  8, 28, 224, 6357, 1050, 320,  80, 1450, 4907, 'DRAFT');

-- Performance reviews
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, quality_score, productivity_score, communication_score, teamwork_score, punctuality_score, overall_score, feedback, goals) VALUES
    (2, 1, '2025-01-01', '2025-06-30', 5, 4, 5, 4, 4, 4.40, 'Excellent work on the Q2 release. Strong technical skills and teamwork.', 'Lead a cross-functional project in Q3.'),
    (3, 1, '2025-01-01', '2025-06-30', 4, 4, 3, 5, 5, 4.20, 'Great team player. Communication with engineering could improve.', 'Attend technical standups weekly.'),
    (4, 1, '2025-01-01', '2025-06-30', 4, 5, 4, 4, 5, 4.40, 'Very reliable and detail-oriented. Always on time.', 'Mentor a junior team member.'),
    (5, 1, '2025-01-01', '2025-06-30', 3, 4, 4, 3, 4, 3.60, 'Solid QA work. Could improve test coverage documentation.', 'Increase automated test coverage to 80%.');
