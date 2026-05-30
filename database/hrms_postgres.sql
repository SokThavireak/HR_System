/*
 * ================================================================
 * HRMS — PostgreSQL DDL
 * Create with:   psql -U <user> -d <db> -f hrms_postgres.sql
 * DB name:       hrms
 * User:          hrms_app        (CHANGE the password)
 * ================================================================
 */

-- CREATE DATABASE hrms;
-- CREATE USER hrms_app WITH ENCRYPTED PASSWORD 'CHANGE_ME_NOW';
-- GRANT ALL PRIVILEGES ON DATABASE hrms TO hrms_app;

-- connect:  \c hrms

BEGIN;

/* ── EXTENSIONS ─────────────────────────────────────────────── */
CREATE EXTENSION IF NOT EXISTS pgcrypto;

/* ── SEQUENCES ──────────────────────────────────────────────── */
CREATE SEQUENCE IF NOT EXISTS seq_user_id      START 1001;
CREATE SEQUENCE IF NOT EXISTS seq_role_id      START 101;
CREATE SEQUENCE IF NOT EXISTS seq_attendance_id START 10001;
CREATE SEQUENCE IF NOT EXISTS seq_leave_id      START 20001;
CREATE SEQUENCE IF NOT EXISTS seq_payroll_id    START 30001;
CREATE SEQUENCE IF NOT EXISTS seq_review_id     START 40001;

/* ── TABLE: roles ───────────────────────────────────────────── */
CREATE TABLE roles (
    id          BIGINT       PRIMARY KEY DEFAULT nextval('seq_role_id'),
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

/* ── TABLE: users ───────────────────────────────────────────── */
CREATE TABLE users (
    id              BIGINT       PRIMARY KEY DEFAULT nextval('seq_user_id'),
    first_name      VARCHAR(80)  NOT NULL,
    last_name       VARCHAR(80)  NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    department      VARCHAR(80),
    position        VARCHAR(100),
    base_salary     NUMERIC(12,2) NOT NULL DEFAULT 0,
    hire_date       DATE,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

/* ── TABLE: user_roles (many-to-many) ───────────────────────── */
CREATE TABLE user_roles (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  BIGINT NOT NULL REFERENCES roles(id)  ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

/* ── TABLE: attendance ──────────────────────────────────────── */
CREATE TABLE attendance (
    id              BIGINT       PRIMARY KEY DEFAULT nextval('seq_attendance_id'),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendance_date DATE         NOT NULL,
    clock_in        TIMESTAMPTZ,
    clock_out       TIMESTAMPTZ,
    worked_hours    NUMERIC(5,2),
    status          VARCHAR(20)  NOT NULL DEFAULT 'PRESENT'
                    CHECK (status IN ('PRESENT','LATE','ABSENT','HALF_DAY','ON_LEAVE')),
    source          VARCHAR(30)  NOT NULL DEFAULT 'CLOCK_IN'
                    CHECK (source IN ('CLOCK_IN','MANUAL','IMPORT')),
    note            TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (user_id, attendance_date)
);

/* ── TABLE: leaves ──────────────────────────────────────────── */
CREATE TABLE leaves (
    id              BIGINT       PRIMARY KEY DEFAULT nextval('seq_leave_id'),
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type      VARCHAR(30)  NOT NULL
                    CHECK (leave_type IN ('ANNUAL','SICK','EMERGENCY','MATERNITY','PATERNITY','UNPAID')),
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL,
    total_days      INT          NOT NULL,
    reason          TEXT         NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED')),
    rejection_reason TEXT,
    approved_by     BIGINT       REFERENCES users(id),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

/* ── TABLE: payroll ─────────────────────────────────────────── */
CREATE TABLE payroll (
    id                   BIGINT       PRIMARY KEY DEFAULT nextval('seq_payroll_id'),
    user_id              BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pay_period_start     DATE         NOT NULL,
    pay_period_end       DATE         NOT NULL,
    base_salary          NUMERIC(12,2) NOT NULL DEFAULT 0,
    extra_salary         NUMERIC(12,2) NOT NULL DEFAULT 0,
    overtime_hours       NUMERIC(6,2)  NOT NULL DEFAULT 0,
    overtime_rate        NUMERIC(8,2)  NOT NULL DEFAULT 0,
    overtime_pay         NUMERIC(12,2) NOT NULL DEFAULT 0,
    gross_salary         NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_deduction        NUMERIC(12,2) NOT NULL DEFAULT 0,
    insurance_deduction  NUMERIC(12,2) NOT NULL DEFAULT 0,
    other_deductions     NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_deductions     NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_salary           NUMERIC(12,2) NOT NULL DEFAULT 0,
    status               VARCHAR(20)  NOT NULL DEFAULT 'DRAFT'
                         CHECK (status IN ('DRAFT','PROCESSED','PAID')),
    processed_at         TIMESTAMPTZ,
    paid_at              TIMESTAMPTZ,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_pay_period CHECK (pay_period_end >= pay_period_start)
);

/* ── TABLE: performance_reviews ─────────────────────────────── */
CREATE TABLE performance_reviews (
    id                   BIGINT       PRIMARY KEY DEFAULT nextval('seq_review_id'),
    employee_id          BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_id          BIGINT       REFERENCES users(id),
    review_period_start  DATE         NOT NULL,
    review_period_end    DATE         NOT NULL,
    quality_score        SMALLINT     NOT NULL CHECK (quality_score BETWEEN 1 AND 5),
    productivity_score   SMALLINT     NOT NULL CHECK (productivity_score BETWEEN 1 AND 5),
    communication_score  SMALLINT     NOT NULL CHECK (communication_score BETWEEN 1 AND 5),
    teamwork_score       SMALLINT     NOT NULL CHECK (teamwork_score BETWEEN 1 AND 5),
    punctuality_score    SMALLINT     NOT NULL CHECK (punctuality_score BETWEEN 1 AND 5),
    overall_score        NUMERIC(3,2) NOT NULL,
    feedback             TEXT         NOT NULL,
    goals                TEXT,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_review_period CHECK (review_period_end >= review_period_start)
);

/* ── INDEXES ────────────────────────────────────────────────── */
CREATE INDEX idx_attendance_user_date ON attendance(user_id, attendance_date);
CREATE INDEX idx_attendance_date      ON attendance(attendance_date);
CREATE INDEX idx_leaves_user         ON leaves(user_id);
CREATE INDEX idx_leaves_status       ON leaves(status);
CREATE INDEX idx_payroll_user        ON payroll(user_id);
CREATE INDEX idx_payroll_status      ON payroll(status);
CREATE INDEX idx_reviews_employee    ON performance_reviews(employee_id);
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_department   ON users(department);

/* ── TRIGGER: auto-update updated_at ────────────────────────── */
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated      ON users;
DROP TRIGGER IF EXISTS trg_attendance_updated ON attendance;
DROP TRIGGER IF EXISTS trg_leaves_updated     ON leaves;
DROP TRIGGER IF EXISTS trg_payroll_updated    ON payroll;
DROP TRIGGER IF EXISTS trg_reviews_updated    ON performance_reviews;

CREATE TRIGGER trg_users_updated      BEFORE UPDATE ON users              FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON attendance         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leaves_updated     BEFORE UPDATE ON leaves             FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_payroll_updated    BEFORE UPDATE ON payroll            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reviews_updated    BEFORE UPDATE ON performance_reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

/* ── SEED DATA ──────────────────────────────────────────────── */
INSERT INTO roles (name, description) VALUES
    ('ROLE_EMPLOYEE',  'Standard employee'),
    ('ROLE_HR_ADMIN',  'HR administrator with full access');

-- password = 'changeme'  (bcrypt hash)
INSERT INTO users (first_name, last_name, email, password_hash, phone, department, position, base_salary, hire_date, active)
VALUES
    ('Admin',   'System',  'admin@hrms.local',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1-000-000-0000', 'HR',        'HR Administrator', 90000, '2024-01-01', TRUE),
    ('Jane',    'Doe',     'jane@hrms.local',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1-111-111-1111', 'Engineering', 'Software Engineer', 75000, '2024-03-15', TRUE),
    ('John',    'Smith',   'john@hrms.local',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1-222-222-2222', 'Marketing',    'Marketing Lead',   68000, '2024-06-01', TRUE),
    ('Alice',   'Nguyen',  'alice@hrms.local',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1-333-333-3333', 'Finance',      'Accountant',       62000, '2024-08-10', TRUE),
    ('Bob',     'Kim',     'bob@hrms.local',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1-444-444-4444', 'Engineering', 'QA Engineer',      70000, '2025-01-20', TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
    (1001, 102),  -- admin → ROLE_HR_ADMIN
    (1002, 101),  -- jane  → ROLE_EMPLOYEE
    (1003, 101),  -- john  → ROLE_EMPLOYEE
    (1004, 101),  -- alice → ROLE_EMPLOYEE
    (1005, 101);  -- bob   → ROLE_EMPLOYEE

-- sample attendance (last 5 days)
INSERT INTO attendance (user_id, attendance_date, clock_in, clock_out, worked_hours, status, source) VALUES
    (1002, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN'),
    (1002, CURRENT_DATE - 3, now() - interval '3 days 9 hours',  now() - interval '3 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN'),
    (1002, CURRENT_DATE - 2, now() - interval '2 days 9 hours',  now() - interval '2 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN'),
    (1002, CURRENT_DATE - 1, now() - interval '1 days 9 hours',  now() - interval '1 days 1 hour',  8.0, 'LATE',    'CLOCK_IN'),
    (1003, CURRENT_DATE - 4, now() - interval '4 days 8 hours',  now() - interval '4 days 0 hours', 8.0, 'PRESENT', 'CLOCK_IN'),
    (1003, CURRENT_DATE - 3, now() - interval '3 days 8 hours',  now() - interval '3 days 0 hours', 8.0, 'PRESENT', 'CLOCK_IN'),
    (1003, CURRENT_DATE - 2, NULL,                                    NULL,                            NULL, 'ABSENT',  'MANUAL'),
    (1004, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN'),
    (1004, CURRENT_DATE - 3, now() - interval '3 days 9 hours',  now() - interval '3 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN'),
    (1005, CURRENT_DATE - 4, now() - interval '4 days 9 hours',  now() - interval '4 days 1 hour',  8.0, 'PRESENT', 'CLOCK_IN');

-- sample leaves
INSERT INTO leaves (user_id, leave_type, start_date, end_date, total_days, reason, status) VALUES
    (1002, 'ANNUAL',   CURRENT_DATE + 10, CURRENT_DATE + 14, 5, 'Family vacation',        'PENDING'),
    (1003, 'SICK',     CURRENT_DATE - 2,  CURRENT_DATE,      3, 'Flu',                     'APPROVED'),
    (1004, 'EMERGENCY',CURRENT_DATE + 3,  CURRENT_DATE + 3,  1, 'Family emergency',        'PENDING'),
    (1005, 'ANNUAL',   CURRENT_DATE + 20, CURRENT_DATE + 25, 6, 'Travel to hometown',      'PENDING');

-- sample payroll
INSERT INTO payroll (user_id, pay_period_start, pay_period_end, base_salary, extra_salary, overtime_hours, overtime_rate, overtime_pay, gross_salary, tax_deduction, insurance_deduction, other_deductions, total_deductions, net_salary, status) VALUES
    (1002, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 6250, 500, 10, 30, 300, 7050, 1200, 350, 100, 1650, 5400, 'PAID'),
    (1003, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5667, 200,  5, 25, 125, 5992, 1000, 300,  50, 1350, 4642, 'PROCESSED'),
    (1004, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5167,   0,  0,  0,   0, 5167,  800, 250,   0, 1050, 4117, 'DRAFT'),
    (1005, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day', 5833, 300,  8, 28, 224, 6357, 1050, 320,  80, 1450, 4907, 'DRAFT');

-- sample performance reviews
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, quality_score, productivity_score, communication_score, teamwork_score, punctuality_score, overall_score, feedback, goals) VALUES
    (1002, 1001, '2025-01-01', '2025-06-30', 5, 4, 5, 4, 4, 4.40, 'Excellent work on the Q2 release. Strong technical skills and teamwork.', 'Lead a cross-functional project in Q3.'),
    (1003, 1001, '2025-01-01', '2025-06-30', 4, 4, 3, 5, 5, 4.20, 'Great team player. Communication with engineering could improve.', 'Attend technical standups weekly.'),
    (1004, 1001, '2025-01-01', '2025-06-30', 4, 5, 4, 4, 5, 4.40, 'Very reliable and detail-oriented. Always on time.', 'Mentor a junior team member.'),
    (1005, 1001, '2025-01-01', '2025-06-30', 3, 4, 4, 3, 4, 3.60, 'Solid QA work. Could improve test coverage documentation.', 'Increase automated test coverage to 80%.');

COMMIT;

/* ── GRANTS ─────────────────────────────────────────────────── */
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO hrms_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hrms_app;
GRANT USAGE ON SCHEMA public TO hrms_app;
