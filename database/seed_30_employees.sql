/*
 * ================================================================
 * HRMS — Seed 30 Employees with Full Month Data
 *
 * Prerequisites:
 *   1. Backend must have been started so Hibernate creates tables
 *   2. Roles must exist (run hrms_postgres.sql first or start the app)
 *   3. Admin user must exist as user_id = 1
 *
 * This script inserts:
 *   - 30 employees across 8 departments with realistic salaries
 *   - User roles (all ROLE_EMPLOYEE)
 *   - 1 month of attendance records (June 2025, Mon-Fri, 22 work days)
 *   - Leave requests (mix of approved, pending, rejected)
 *   - Payroll for the current month
 *   - Performance reviews for the current period
 *
 * All passwords = 'changeme' (same bcrypt hash)
 *
 * Usage:
 *   psql -U postgres -d hr_system -f seed_30_employees.sql
 * ================================================================
 */

BEGIN;

/* ═══════════════════════════════════════════════════════════════════
   1. EMPLOYEES (30 users, all ROLE_EMPLOYEE)
   Password hash = 'changeme'
   ═══════════════════════════════════════════════════════════════════ */

INSERT INTO users (email, password, first_name, last_name, phone, department, position, base_salary, hire_date, active, created_at, updated_at) VALUES
  -- ── Engineering (6) ──
  ('sophia.chen@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Sophia',   'Chen',     '+1-555-0201', 'Engineering', 'Senior Software Engineer',               95000, '2023-01-09', TRUE, NOW(), NOW()),
  ('marcus.johnson@hrms.local','$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Marcus',   'Johnson',  '+1-555-0202', 'Engineering', 'Software Engineer',                       75000, '2023-04-17', TRUE, NOW(), NOW()),
  ('priya.patel@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Priya',    'Patel',    '+1-555-0203', 'Engineering', 'DevOps Engineer',                         82000, '2023-07-24', TRUE, NOW(), NOW()),
  ('david.kim@hrms.local',     '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'David',    'Kim',      '+1-555-0204', 'Engineering', 'Frontend Developer',                      70000, '2024-01-15', TRUE, NOW(), NOW()),
  ('aisha.ahmed@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Aisha',    'Ahmed',    '+1-555-0205', 'Engineering', 'Backend Developer',                       73000, '2024-02-20', TRUE, NOW(), NOW()),
  ('carlos.reyes@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Carlos',   'Reyes',    '+1-555-0206', 'Engineering', 'QA Lead',                                 78000, '2023-09-05', TRUE, NOW(), NOW()),

  -- ── Marketing (4) ──
  ('emily.wang@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Emily',    'Wang',     '+1-555-0207', 'Marketing',   'Marketing Manager',                       80000, '2022-11-01', TRUE, NOW(), NOW()),
  ('james.martin@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'James',    'Martin',   '+1-555-0208', 'Marketing',   'Content Strategist',                      60000, '2023-06-12', TRUE, NOW(), NOW()),
  ('olga.smirnova@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Olga',     'Smirnova', '+1-555-0209', 'Marketing',   'SEO Specialist',                          55000, '2024-03-01', TRUE, NOW(), NOW()),
  ('raj.gupta@hrms.local',     '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Raj',      'Gupta',    '+1-555-0210', 'Marketing',   'Social Media Manager',                    58000, '2024-05-20', TRUE, NOW(), NOW()),

  -- ── Finance (3) ──
  ('lisa.thompson@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Lisa',     'Thompson', '+1-555-0211', 'Finance',     'Finance Manager',                         88000, '2022-06-15', TRUE, NOW(), NOW()),
  ('mohammed.ali@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Mohammed', 'Ali',      '+1-555-0212', 'Finance',     'Senior Accountant',                       68000, '2023-02-10', TRUE, NOW(), NOW()),
  ('fatima.hassan@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Fatima',   'Hassan',   '+1-555-0213', 'Finance',     'Financial Analyst',                       62000, '2024-04-01', TRUE, NOW(), NOW()),

  -- ── Human Resources (3) ──
  ('anna.mueller@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Anna',     'Mueller',  '+1-555-0214', 'Human Resources', 'HR Manager',                          78000, '2022-08-20', TRUE, NOW(), NOW()),
  ('kevin.brown@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Kevin',    'Brown',    '+1-555-0215', 'Human Resources', 'Recruiter',                           55000, '2023-11-15', TRUE, NOW(), NOW()),
  ('nguyen.tran@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Nguyen',   'Tran',     '+1-555-0216', 'Human Resources', 'HR Coordinator',                      50000, '2024-06-10', TRUE, NOW(), NOW()),

  -- ── Sales (4) ──
  ('robert.wilson@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Robert',   'Wilson',   '+1-555-0217', 'Sales',       'Sales Director',                          92000, '2022-03-01', TRUE, NOW(), NOW()),
  ('sara.dupont@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Sara',     'Dupont',   '+1-555-0218', 'Sales',       'Account Executive',                       65000, '2023-05-15', TRUE, NOW(), NOW()),
  ('daniel.lee@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Daniel',   'Lee',      '+1-555-0219', 'Sales',       'Sales Representative',                    52000, '2024-01-30', TRUE, NOW(), NOW()),
  ('mei.lin@hrms.local',       '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Mei',      'Lin',      '+1-555-0220', 'Sales',       'Business Development Rep',                56000, '2024-07-01', TRUE, NOW(), NOW()),

  -- ── Operations (3) ──
  ('peter.jones@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Peter',    'Jones',    '+1-555-0221', 'Operations',  'Operations Manager',                      85000, '2022-09-10', TRUE, NOW(), NOW()),
  ('linda.zhang@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Linda',    'Zhang',    '+1-555-0222', 'Operations',  'Logistics Coordinator',                   58000, '2023-08-22', TRUE, NOW(), NOW()),
  ('omar.farouk@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Omar',     'Farouk',   '+1-555-0223', 'Operations',  'Supply Chain Analyst',                    61000, '2024-02-14', TRUE, NOW(), NOW()),

  -- ── Design (3) ──
  ('isabella.rossi@hrms.local','$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Isabella', 'Rossi',    '+1-555-0224', 'Design',      'Lead UX Designer',                        82000, '2022-12-05', TRUE, NOW(), NOW()),
  ('tom.harris@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Tom',      'Harris',   '+1-555-0225', 'Design',      'UI Designer',                             67000, '2023-10-01', TRUE, NOW(), NOW()),
  ('nadia.petrova@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Nadia',    'Petrova',  '+1-555-0226', 'Design',      'Graphic Designer',                        54000, '2024-04-20', TRUE, NOW(), NOW()),

  -- ── Legal (2) ──
  ('william.scott@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'William',  'Scott',    '+1-555-0227', 'Legal',       'General Counsel',                         105000,'2022-01-20', TRUE, NOW(), NOW()),
  ('claire.dubois@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Claire',   'Dubois',   '+1-555-0228', 'Legal',       'Legal Analyst',                           65000, '2023-07-10', TRUE, NOW(), NOW()),

  -- ── Customer Support (2) ──
  ('alex.morgan@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Alex',     'Morgan',   '+1-555-0229', 'Customer Support', 'Support Manager',                     72000, '2023-03-20', TRUE, NOW(), NOW()),
  ('jenny.adams@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa', 'Jenny',    'Adams',    '+1-555-0230', 'Customer Support', 'Support Specialist',                  48000, '2024-08-01', TRUE, NOW(), NOW());


/* ═══════════════════════════════════════════════════════════════════
   2. USER ROLES — assign ROLE_EMPLOYEE (role_id = 2) to all 30 new employees
   Their user_ids start at 6 (after admin + 4 existing seed users)
   ═══════════════════════════════════════════════════════════════════ */

INSERT INTO user_roles (user_id, role_id)
SELECT id, 2 FROM users WHERE id >= 6;


/* ═══════════════════════════════════════════════════════════════════
   3. ATTENDANCE — Full month of June 2025 (Mon–Fri)
   June 2025 work days: 2,3,4,5,6, 9,10,11,12,13, 16,17,18,19,20,
                        23,24,25,26,27, 30  = 21 work days
   ═══════════════════════════════════════════════════════════════════ */

-- We generate attendance for users 6-35 (30 employees) for each work day.
-- Most days are PRESENT with 8 hours. Some have LATE, ABSENT, HALF_DAY.

DO $$
DECLARE
  uid INTEGER;
  d DATE;
  work_days DATE[] := ARRAY[
    '2025-06-02','2025-06-03','2025-06-04','2025-06-05','2025-06-06',
    '2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13',
    '2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20',
    '2025-06-23','2025-06-24','2025-06-25','2025-06-26','2025-06-27',
    '2025-06-30'
  ];
  day_count INTEGER := array_length(work_days, 1);
  idx INTEGER;
  status TEXT;
  clock_in TIMESTAMP;
  clock_out TIMESTAMP;
  hours DOUBLE PRECISION;
  late_mins INTEGER;
BEGIN
  FOR uid IN 6..35 LOOP
    FOR idx IN 1..day_count LOOP
      d := work_days[idx];

      -- Determine status based on user and day to create variety
      status := 'PRESENT';
      hours := 8.0;
      late_mins := 0;

      -- Every 7th user: occasional late
      IF uid % 7 = 0 AND idx % 5 = 0 THEN
        status := 'LATE';
        late_mins := 15 + (idx % 3) * 10;
      -- Every 11th user: occasional absence
      ELSIF uid % 11 = 0 AND idx % 8 = 0 THEN
        status := 'ABSENT';
        hours := 0;
        late_mins := 0;
      -- Every 5th user: occasional half day
      ELSIF uid % 5 = 0 AND idx % 10 = 0 THEN
        status := 'HALF_DAY';
        hours := 4.0;
      -- Every 13th user: occasional late
      ELSIF uid % 13 = 0 AND idx % 6 = 0 THEN
        status := 'LATE';
        late_mins := 20;
      END IF;

      -- Clock in: normally 09:00, late adds minutes
      IF status = 'ABSENT' THEN
        clock_in := NULL;
        clock_out := NULL;
      ELSIF status = 'LATE' THEN
        clock_in := d + interval '9 hours' + (late_mins || ' minutes')::interval;
        clock_out := d + interval '17 hours' + (late_mins || ' minutes')::interval;
      ELSIF status = 'HALF_DAY' THEN
        clock_in := d + interval '9 hours';
        clock_out := d + interval '13 hours';
      ELSE
        -- PRESENT: some arrive early (08:45-09:00)
        clock_in := d + interval '8 hours 50 minutes' + ((idx % 10) || ' minutes')::interval;
        clock_out := d + interval '17 hours 10 minutes' + ((idx % 5) || ' minutes')::interval;
      END IF;

      INSERT INTO attendance (user_id, date, clock_in_time, clock_out_time, hours_worked, status, late_mins)
      VALUES (uid, d, clock_in, clock_out, hours, status::text, late_mins);
    END LOOP;
  END LOOP;
END $$;


/* ═══════════════════════════════════════════════════════════════════
   4. LEAVE REQUESTS — Mix of types and statuses
   ═══════════════════════════════════════════════════════════════════ */

INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason, status, approved_by, approved_at, created_at, updated_at) VALUES
  -- Approved leaves
  (6,  'ANNUAL',    '2025-06-09', '2025-06-13', 5, 'Family vacation to Hawaii',                    'APPROVED', 1, '2025-06-01 10:00:00', NOW(), NOW()),
  (10, 'SICK',      '2025-06-16', '2025-06-17', 2, 'Medical appointment and recovery',              'APPROVED', 1, '2025-06-15 09:00:00', NOW(), NOW()),
  (15, 'ANNUAL',    '2025-06-23', '2025-06-27', 5, 'Summer break with family',                      'APPROVED', 1, '2025-06-10 14:00:00', NOW(), NOW()),
  (20, 'EMERGENCY', '2025-06-04', '2025-06-04', 1, 'Family emergency — parent hospitalized',        'APPROVED', 1, '2025-06-04 08:30:00', NOW(), NOW()),
  (25, 'ANNUAL',    '2025-06-16', '2025-06-20', 5, 'Trip to Japan',                                 'APPROVED', 1, '2025-06-05 11:00:00', NOW(), NOW()),
  (30, 'SICK',      '2025-06-25', '2025-06-26', 2, 'Dental surgery recovery',                       'APPROVED', 1, '2025-06-24 16:00:00', NOW(), NOW()),

  -- Pending leaves
  (7,  'ANNUAL',    '2025-07-07', '2025-07-11', 5, 'Visiting relatives overseas',                   'PENDING',  NULL, NULL, NOW(), NOW()),
  (12, 'SICK',      '2025-07-01', '2025-07-02', 2, 'Scheduled surgery',                             'PENDING',  NULL, NULL, NOW(), NOW()),
  (18, 'MATERNITY', '2025-07-14', '2025-08-14', 30,'Maternity leave',                                'PENDING',  NULL, NULL, NOW(), NOW()),
  (22, 'ANNUAL',    '2025-07-21', '2025-07-25', 5, 'Wedding anniversary trip',                      'PENDING',  NULL, NULL, NOW(), NOW()),
  (28, 'EMERGENCY', '2025-07-03', '2025-07-03', 1, 'Home repair emergency',                         'PENDING',  NULL, NULL, NOW(), NOW()),

  -- Rejected leaves
  (8,  'ANNUAL',    '2025-06-09', '2025-06-13', 5, 'Personal travel',                               'REJECTED', 1, '2025-06-02 09:00:00', NOW(), NOW()),
  (14, 'UNPAID',    '2025-06-23', '2025-07-04', 10,'Extended personal project',                     'REJECTED', 1, '2025-06-12 10:00:00', NOW(), NOW()),
  (24, 'ANNUAL',    '2025-06-16', '2025-06-27', 10,'Too many team members already on leave',        'REJECTED', 1, '2025-06-08 15:00:00', NOW(), NOW());


/* ═══════════════════════════════════════════════════════════════════
   5. PAYROLL — June 2025 pay period for all 30 employees
   Pay period: 2025-06-01 to 2025-06-30
   ═══════════════════════════════════════════════════════════════════ */

INSERT INTO payroll (user_id, pay_period_start, pay_period_end, base_salary, extra_salary, overtime_hours, overtime_pay, gross_salary, tax_deduction, insurance_deduction, other_deductions, total_deductions, net_salary, status, payment_date) VALUES
  -- Engineering
  (6,  '2025-06-01', '2025-06-30', 7916.67,  500.00, 10, 300.00,  8716.67, 1450.00, 350.00, 100.00, 1900.00, 6816.67, 'PAID',     '2025-07-05'),
  (7,  '2025-06-01', '2025-06-30', 6250.00,  300.00,  5, 125.00,  6675.00, 1050.00, 280.00,  50.00, 1380.00, 5295.00, 'PAID',     '2025-07-05'),
  (8,  '2025-06-01', '2025-06-30', 6833.33,  400.00,  8, 200.00,  7433.33, 1200.00, 310.00,  75.00, 1585.00, 5848.33, 'PAID',     '2025-07-05'),
  (9,  '2025-06-01', '2025-06-30', 5833.33,  200.00,  3,  75.00,  6108.33,  950.00, 250.00,  25.00, 1225.00, 4883.33, 'PROCESSED', NULL),
  (10, '2025-06-01', '2025-06-30', 6083.33,  250.00,  4, 100.00,  6433.33, 1000.00, 265.00,  30.00, 1295.00, 5138.33, 'PROCESSED', NULL),
  (11, '2025-06-01', '2025-06-30', 6500.00,  350.00,  6, 150.00,  7000.00, 1120.00, 290.00,  60.00, 1470.00, 5530.00, 'DRAFT',    NULL),

  -- Marketing
  (12, '2025-06-01', '2025-06-30', 6666.67,  400.00,  5, 125.00,  7191.67, 1150.00, 300.00,  50.00, 1500.00, 5691.67, 'PAID',     '2025-07-05'),
  (13, '2025-06-01', '2025-06-30', 5000.00,  150.00,  2,  50.00,  5200.00,  800.00, 220.00,  20.00, 1040.00, 4160.00, 'PAID',     '2025-07-05'),
  (14, '2025-06-01', '2025-06-30', 4583.33,  100.00,  0,   0.00,  4683.33,  700.00, 200.00,  15.00,  915.00, 3768.33, 'PROCESSED', NULL),
  (15, '2025-06-01', '2025-06-30', 4833.33,  200.00,  3,  75.00,  5108.33,  780.00, 210.00,  25.00, 1015.00, 4093.33, 'DRAFT',    NULL),

  -- Finance
  (16, '2025-06-01', '2025-06-30', 7333.33,  500.00,  4, 100.00,  7933.33, 1300.00, 330.00,  80.00, 1710.00, 6223.33, 'PAID',     '2025-07-05'),
  (17, '2025-06-01', '2025-06-30', 5666.67,  300.00,  3,  75.00,  6041.67,  950.00, 255.00,  40.00, 1245.00, 4796.67, 'PROCESSED', NULL),
  (18, '2025-06-01', '2025-06-30', 5166.67,  200.00,  2,  50.00,  5416.67,  820.00, 230.00,  30.00, 1080.00, 4336.67, 'DRAFT',    NULL),

  -- Human Resources
  (19, '2025-06-01', '2025-06-30', 6500.00,  350.00,  3,  75.00,  6925.00, 1100.00, 290.00,  50.00, 1440.00, 5485.00, 'PAID',     '2025-07-05'),
  (20, '2025-06-01', '2025-06-30', 4583.33,  150.00,  1,  25.00,  4758.33,  720.00, 200.00,  20.00,  940.00, 3818.33, 'PROCESSED', NULL),
  (21, '2025-06-01', '2025-06-30', 4166.67,  100.00,  0,   0.00,  4266.67,  630.00, 185.00,  15.00,  830.00, 3436.67, 'DRAFT',    NULL),

  -- Sales
  (22, '2025-06-01', '2025-06-30', 7666.67, 1000.00,  5, 250.00,  8916.67, 1500.00, 360.00, 100.00, 1960.00, 6956.67, 'PAID',     '2025-07-05'),
  (23, '2025-06-01', '2025-06-30', 5416.67,  500.00,  3, 125.00,  6041.67,  950.00, 255.00,  40.00, 1245.00, 4796.67, 'PAID',     '2025-07-05'),
  (24, '2025-06-01', '2025-06-30', 4333.33,  200.00,  2,  50.00,  4583.33,  680.00, 195.00,  20.00,  895.00, 3688.33, 'PROCESSED', NULL),
  (25, '2025-06-01', '2025-06-30', 4666.67,  300.00,  4, 100.00,  5066.67,  780.00, 210.00,  30.00, 1020.00, 4046.67, 'DRAFT',    NULL),

  -- Operations
  (26, '2025-06-01', '2025-06-30', 7083.33,  400.00,  4, 100.00,  7583.33, 1220.00, 315.00,  60.00, 1595.00, 5988.33, 'PAID',     '2025-07-05'),
  (27, '2025-06-01', '2025-06-30', 4833.33,  200.00,  2,  50.00,  5083.33,  780.00, 210.00,  25.00, 1015.00, 4068.33, 'PROCESSED', NULL),
  (28, '2025-06-01', '2025-06-30', 5083.33,  250.00,  3,  75.00,  5408.33,  830.00, 225.00,  30.00, 1085.00, 4323.33, 'DRAFT',    NULL),

  -- Design
  (29, '2025-06-01', '2025-06-30', 6833.33,  400.00,  5, 125.00,  7358.33, 1180.00, 305.00,  55.00, 1540.00, 5818.33, 'PAID',     '2025-07-05'),
  (30, '2025-06-01', '2025-06-30', 5583.33,  250.00,  2,  50.00,  5883.33,  900.00, 245.00,  30.00, 1175.00, 4708.33, 'PROCESSED', NULL),
  (31, '2025-06-01', '2025-06-30', 4500.00,  150.00,  1,  25.00,  4675.00,  690.00, 195.00,  20.00,  905.00, 3770.00, 'DRAFT',    NULL),

  -- Legal
  (32, '2025-06-01', '2025-06-30', 8750.00,  600.00,  2, 100.00,  9450.00, 1600.00, 400.00, 100.00, 2100.00, 7350.00, 'PAID',     '2025-07-05'),
  (33, '2025-06-01', '2025-06-30', 5416.67,  300.00,  1,  25.00,  5741.67,  880.00, 240.00,  35.00, 1155.00, 4586.67, 'PROCESSED', NULL),

  -- Customer Support
  (34, '2025-06-01', '2025-06-30', 6000.00,  350.00,  4, 100.00,  6450.00, 1000.00, 270.00,  40.00, 1310.00, 5140.00, 'PAID',     '2025-07-05'),
  (35, '2025-06-01', '2025-06-30', 4000.00,  150.00,  1,  25.00,  4175.00,  600.00, 175.00,  15.00,  790.00, 3385.00, 'DRAFT',    NULL);


/* ═══════════════════════════════════════════════════════════════════
   6. PERFORMANCE REVIEWS — H1 2025 (Jan–Jun) for all 30 employees
   Reviewed by admin (user_id = 1)
   ═══════════════════════════════════════════════════════════════════ */

INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, quality_score, productivity_score, communication_score, teamwork_score, punctuality_score, overall_score, feedback, goals, improvements, created_at, updated_at) VALUES
  -- Engineering
  (6,  1, '2025-01-01', '2025-06-30', 5, 5, 4, 5, 5, 4.80, 'Exceptional technical leadership. Drove the microservices migration ahead of schedule and mentored 3 junior developers.', 'Architect the new payment gateway system', 'Continue mentoring; consider presenting at a tech conference', NOW(), NOW()),
  (7,  1, '2025-01-01', '2025-06-30', 4, 4, 4, 4, 5, 4.20, 'Solid contributor. Delivered all sprint commitments on time. Great team player in cross-functional projects.', 'Take ownership of a major feature end-to-end', 'Improve system design documentation skills', NOW(), NOW()),
  (8,  1, '2025-01-01', '2025-06-30', 5, 5, 3, 4, 4, 4.20, 'Outstanding DevOps work. Reduced deployment time by 60% and improved CI/CD pipeline reliability significantly.', 'Implement infrastructure-as-code for all environments', 'Improve cross-team communication during incidents', NOW(), NOW()),
  (9,  1, '2025-01-01', '2025-06-30', 4, 3, 5, 5, 4, 4.20, 'Creative frontend developer with excellent UI sensibility. Users consistently praise the interfaces built.', 'Lead the design system initiative', 'Deepen backend knowledge for full-stack capability', NOW(), NOW()),
  (10, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 3, 5, 4.00, 'Reliable backend developer. API response times improved 30% under ownership. Very punctual and disciplined.', 'Take on a mentoring role for interns', 'Participate more actively in architecture discussions', NOW(), NOW()),
  (11, 1, '2025-01-01', '2025-06-30', 5, 4, 4, 4, 4, 4.20, 'Excellent QA lead. Bug escape rate dropped 40% this period. Introduced automated testing best practices.', 'Achieve 85% automated test coverage', 'Develop load testing framework for critical paths', NOW(), NOW()),

  -- Marketing
  (12, 1, '2025-01-01', '2025-06-30', 5, 5, 5, 5, 4, 4.80, 'Outstanding marketing leadership. The Q2 campaign exceeded targets by 35%. Exceptional strategic thinking.', 'Develop the 2026 marketing strategy roadmap', 'Explore AI-driven personalization for campaigns', NOW(), NOW()),
  (13, 1, '2025-01-01', '2025-06-30', 4, 4, 5, 4, 5, 4.40, 'Creative content strategist. Blog traffic increased 120% and social engagement doubled under leadership.', 'Launch a podcast series', 'Improve data analytics skills for content ROI', NOW(), NOW()),
  (14, 1, '2025-01-01', '2025-06-30', 4, 5, 3, 4, 5, 4.20, 'SEO results are impressive — organic traffic up 80%. Very data-driven and methodical approach.', 'Expand SEO strategy to international markets', 'Improve content writing skills', NOW(), NOW()),
  (15, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 5, 4, 4.20, 'Great social media presence built. Follower growth of 200% and engagement rates above industry average.', 'Launch influencer partnership program', 'Develop video content strategy', NOW(), NOW()),

  -- Finance
  (16, 1, '2025-01-01', '2025-06-30', 5, 5, 4, 4, 5, 4.60, 'Excellent financial management. Audit findings reduced to zero. Budget forecasting accuracy improved to 98%.', 'Implement rolling forecast model', 'Mentor junior finance team members', NOW(), NOW()),
  (17, 1, '2025-01-01', '2025-06-30', 4, 5, 3, 4, 5, 4.20, 'Thorough and accurate accountant. Month-end close time reduced by 2 days. Very reliable.', 'Pursue CPA certification', 'Improve presentation skills for financial reports', NOW(), NOW()),
  (18, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 3, 5, 4.00, 'Strong analytical skills. Financial models built have been instrumental in strategic decisions.', 'Lead the annual budgeting process', 'Develop expertise in financial planning software', NOW(), NOW()),

  -- Human Resources
  (19, 1, '2025-01-01', '2025-06-30', 5, 4, 5, 5, 4, 4.60, 'Exceptional HR leadership. Employee satisfaction scores up 15%. Successfully managed 45 hires this period.', 'Implement employee wellness program', 'Develop succession planning framework', NOW(), NOW()),
  (20, 1, '2025-01-01', '2025-06-30', 4, 5, 4, 4, 5, 4.40, 'Talented recruiter. Time-to-fill reduced by 30%. Great candidate experience scores and strong pipeline built.', 'Build employer branding strategy', 'Improve diversity hiring metrics', NOW(), NOW()),
  (21, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 5, 5, 4.40, 'Organized and dependable HR coordinator. Onboarding process streamlined. Employees feel well-supported.', 'Lead the HRIS optimization project', 'Develop conflict resolution skills', NOW(), NOW()),

  -- Sales
  (22, 1, '2025-01-01', '2025-06-30', 5, 5, 5, 4, 4, 4.60, 'Outstanding sales leadership. Team exceeded quota by 25%. Closed the largest deal in company history.', 'Expand into the APAC market', 'Develop strategic partnership program', NOW(), NOW()),
  (23, 1, '2025-01-01', '2025-06-30', 4, 5, 4, 4, 5, 4.40, 'Top-performing account executive. 130% of quota achieved. Client retention rate of 95%.', 'Move into a team lead role', 'Improve CRM data hygiene practices', NOW(), NOW()),
  (24, 1, '2025-01-01', '2025-06-30', 3, 4, 4, 4, 5, 4.00, 'Promising sales rep with strong work ethic. Pipeline growing steadily. Needs to improve closing techniques.', 'Achieve 100% of quota in Q3', 'Attend advanced negotiation training', NOW(), NOW()),
  (25, 1, '2025-01-01', '2025-06-30', 4, 4, 5, 4, 4, 4.20, 'Strong business development skills. Generated 50+ qualified leads. Great at building initial relationships.', 'Improve lead-to-close conversion rate', 'Develop industry-specific expertise', NOW(), NOW()),

  -- Operations
  (26, 1, '2025-01-01', '2025-06-30', 5, 5, 4, 5, 4, 4.60, 'Excellent operations management. Cost reduction of 12% achieved while maintaining quality. Process improvements outstanding.', 'Implement lean manufacturing principles', 'Develop vendor management scorecards', NOW(), NOW()),
  (27, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 5, 5, 4.40, 'Reliable logistics coordinator. On-time delivery rate improved to 98%. Great relationship with carriers.', 'Optimize warehouse layout', 'Learn data analytics for logistics optimization', NOW(), NOW()),
  (28, 1, '2025-01-01', '2025-06-30', 4, 5, 3, 4, 5, 4.20, 'Sharp supply chain analyst. Inventory optimization saved $200K. Very detail-oriented.', 'Lead supplier diversity initiative', 'Improve presentation of supply chain insights', NOW(), NOW()),

  -- Design
  (29, 1, '2025-01-01', '2025-06-30', 5, 5, 4, 5, 4, 4.60, 'Exceptional UX leadership. User satisfaction scores up 25%. Design system adoption at 100% across teams.', 'Establish design ops function', 'Conduct user research for mobile experience', NOW(), NOW()),
  (30, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 4, 5, 4.20, 'Talented UI designer with great eye for detail. Component library contributions have been invaluable.', 'Lead the accessibility improvement initiative', 'Develop motion design skills', NOW(), NOW()),
  (31, 1, '2025-01-01', '2025-06-30', 4, 3, 5, 5, 4, 4.20, 'Creative graphic designer. Marketing materials quality has significantly improved. Great collaboration skills.', 'Build a brand asset management system', 'Improve video editing capabilities', NOW(), NOW()),

  -- Legal
  (32, 1, '2025-01-01', '2025-06-30', 5, 5, 5, 4, 5, 4.80, 'Outstanding legal counsel. Zero compliance issues. Contract negotiation saved the company $500K.', 'Develop IP protection strategy', 'Implement legal tech automation tools', NOW(), NOW()),
  (33, 1, '2025-01-01', '2025-06-30', 4, 4, 4, 4, 5, 4.20, 'Thorough legal analyst. Contract review turnaround improved by 50%. Very diligent researcher.', 'Specialize in employment law', 'Improve legal writing for executive summaries', NOW(), NOW()),

  -- Customer Support
  (34, 1, '2025-01-01', '2025-06-30', 5, 4, 5, 5, 4, 4.60, 'Excellent support leadership. CSAT scores at all-time high of 96%. Team morale is outstanding.', 'Implement AI-assisted ticket routing', 'Develop customer health scoring model', NOW(), NOW()),
  (35, 1, '2025-01-01', '2025-06-30', 4, 4, 5, 5, 5, 4.60, 'Empathetic and skilled support specialist. First-contact resolution rate of 85%. Customers frequently praise by name.', 'Mentor new support team members', 'Develop technical troubleshooting expertise', NOW(), NOW());


COMMIT;
