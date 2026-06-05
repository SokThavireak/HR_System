/*
 * ================================================================
 * HRMS — Reset & Seed 30 Employees (Clean Slate)
 *
 * WARNING: Deletes ALL non-admin users and their data, then
 * re-creates 30 employees with full June 2025 data.
 *
 * Usage:
 *   psql -U postgres -d hr_system -f reset_and_seed_30.sql
 * ================================================================
 */

BEGIN;

-- ── 1. Delete all non-admin user data ───────────────────────────
DELETE FROM attendance WHERE user_id IN (
    SELECT user_id FROM user_roles WHERE role_id != (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN')
);
DELETE FROM leave_requests WHERE user_id IN (
    SELECT user_id FROM user_roles WHERE role_id != (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN')
);
DELETE FROM payroll WHERE user_id IN (
    SELECT user_id FROM user_roles WHERE role_id != (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN')
);
DELETE FROM performance_reviews WHERE employee_id IN (
    SELECT user_id FROM user_roles WHERE role_id != (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN')
);
DELETE FROM user_roles WHERE role_id != (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN');
DELETE FROM users WHERE id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN')
);

-- Reset identity sequence so new IDs start after admin (id=1)
ALTER SEQUENCE users_id_seq RESTART WITH 2;

-- ── 2. Insert 30 employees ─────────────────────────────────────
INSERT INTO users (email, password, first_name, last_name, phone, department, position, base_salary, hire_date, active, created_at, updated_at) VALUES
  -- Engineering (6)
  ('sophia.chen@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Sophia',   'Chen',     '+1-555-0201','Engineering','Senior Software Engineer',95000,'2023-01-09',TRUE,NOW(),NOW()),
  ('marcus.johnson@hrms.local','$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Marcus',   'Johnson',  '+1-555-0202','Engineering','Software Engineer',75000,'2023-04-17',TRUE,NOW(),NOW()),
  ('priya.patel@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Priya',    'Patel',    '+1-555-0203','Engineering','DevOps Engineer',82000,'2023-07-24',TRUE,NOW(),NOW()),
  ('david.kim@hrms.local',     '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','David',    'Kim',      '+1-555-0204','Engineering','Frontend Developer',70000,'2024-01-15',TRUE,NOW(),NOW()),
  ('aisha.ahmed@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Aisha',    'Ahmed',    '+1-555-0205','Engineering','Backend Developer',73000,'2024-02-20',TRUE,NOW(),NOW()),
  ('carlos.reyes@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Carlos',   'Reyes',    '+1-555-0206','Engineering','QA Lead',78000,'2023-09-05',TRUE,NOW(),NOW()),

  -- Marketing (4)
  ('emily.wang@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Emily',    'Wang',     '+1-555-0207','Marketing','Marketing Manager',80000,'2022-11-01',TRUE,NOW(),NOW()),
  ('james.martin@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','James',    'Martin',   '+1-555-0208','Marketing','Content Strategist',60000,'2023-06-12',TRUE,NOW(),NOW()),
  ('olga.smirnova@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Olga',     'Smirnova', '+1-555-0209','Marketing','SEO Specialist',55000,'2024-03-01',TRUE,NOW(),NOW()),
  ('raj.gupta@hrms.local',     '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Raj',      'Gupta',    '+1-555-0210','Marketing','Social Media Manager',58000,'2024-05-20',TRUE,NOW(),NOW()),

  -- Finance (3)
  ('lisa.thompson@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Lisa',     'Thompson', '+1-555-0211','Finance','Finance Manager',88000,'2022-06-15',TRUE,NOW(),NOW()),
  ('mohammed.ali@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Mohammed', 'Ali',      '+1-555-0212','Finance','Senior Accountant',68000,'2023-02-10',TRUE,NOW(),NOW()),
  ('fatima.hassan@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Fatima',   'Hassan',   '+1-555-0213','Finance','Financial Analyst',62000,'2024-04-01',TRUE,NOW(),NOW()),

  -- Human Resources (3)
  ('anna.mueller@hrms.local',  '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Anna',     'Mueller',  '+1-555-0214','Human Resources','HR Manager',78000,'2022-08-20',TRUE,NOW(),NOW()),
  ('kevin.brown@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Kevin',    'Brown',    '+1-555-0215','Human Resources','Recruiter',55000,'2023-11-15',TRUE,NOW(),NOW()),
  ('nguyen.tran@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Nguyen',   'Tran',     '+1-555-0216','Human Resources','HR Coordinator',50000,'2024-06-10',TRUE,NOW(),NOW()),

  -- Sales (4)
  ('robert.wilson@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Robert',   'Wilson',   '+1-555-0217','Sales','Sales Director',92000,'2022-03-01',TRUE,NOW(),NOW()),
  ('sara.dupont@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Sara',     'Dupont',   '+1-555-0218','Sales','Account Executive',65000,'2023-05-15',TRUE,NOW(),NOW()),
  ('daniel.lee@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Daniel',   'Lee',      '+1-555-0219','Sales','Sales Representative',52000,'2024-01-30',TRUE,NOW(),NOW()),
  ('mei.lin@hrms.local',       '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Mei',      'Lin',      '+1-555-0220','Sales','Business Development Rep',56000,'2024-07-01',TRUE,NOW(),NOW()),

  -- Operations (3)
  ('peter.jones@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Peter',    'Jones',    '+1-555-0221','Operations','Operations Manager',85000,'2022-09-10',TRUE,NOW(),NOW()),
  ('linda.zhang@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Linda',    'Zhang',    '+1-555-0222','Operations','Logistics Coordinator',58000,'2023-08-22',TRUE,NOW(),NOW()),
  ('omar.farouk@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Omar',     'Farouk',   '+1-555-0223','Operations','Supply Chain Analyst',61000,'2024-02-14',TRUE,NOW(),NOW()),

  -- Design (3)
  ('isabella.rossi@hrms.local','$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Isabella', 'Rossi',    '+1-555-0224','Design','Lead UX Designer',82000,'2022-12-05',TRUE,NOW(),NOW()),
  ('tom.harris@hrms.local',    '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Tom',      'Harris',   '+1-555-0225','Design','UI Designer',67000,'2023-10-01',TRUE,NOW(),NOW()),
  ('nadia.petrova@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Nadia',    'Petrova',  '+1-555-0226','Design','Graphic Designer',54000,'2024-04-20',TRUE,NOW(),NOW()),

  -- Legal (2)
  ('william.scott@hrms.local', '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','William',  'Scott',    '+1-555-0227','Legal','General Counsel',105000,'2022-01-20',TRUE,NOW(),NOW()),
  ('claire.dubois@hrms.local','$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Claire',   'Dubois',   '+1-555-0228','Legal','Legal Analyst',65000,'2023-07-10',TRUE,NOW(),NOW()),

  -- Customer Support (2)
  ('alex.morgan@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Alex',     'Morgan',   '+1-555-0229','Customer Support','Support Manager',72000,'2023-03-20',TRUE,NOW(),NOW()),
  ('jenny.adams@hrms.local',   '$2a$10$viqQvQ3EMWwfL/rUxbQJwugrQIuEyPf.Y3flZPNGFAHT.0a9LCTJa','Jenny',    'Adams',    '+1-555-0230','Customer Support','Support Specialist',48000,'2024-08-01',TRUE,NOW(),NOW());

-- ── 3. Assign ROLE_EMPLOYEE to all new users ────────────────────
INSERT INTO user_roles (user_id, role_id)
SELECT id, (SELECT id FROM roles WHERE name = 'ROLE_EMPLOYEE')
FROM users WHERE id != 1;

-- ── 4. Attendance — June 2025 (21 work days) ───────────────────
-- Uses a DO block to generate for all non-admin users
DO $$
DECLARE
  rec RECORD;
  d DATE;
  work_days DATE[] := ARRAY[
    '2025-06-02','2025-06-03','2025-06-04','2025-06-05','2025-06-06',
    '2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13',
    '2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20',
    '2025-06-23','2025-06-24','2025-06-25','2025-06-26','2025-06-27',
    '2025-06-30'
  ];
  nd INTEGER := array_length(work_days, 1);
  i INTEGER;
  st TEXT;
  ci TIMESTAMP;
  co TIMESTAMP;
  hw DOUBLE PRECISION;
  lm INTEGER;
BEGIN
  FOR rec IN SELECT id FROM users WHERE id != 1 LOOP
    FOR i IN 1..nd LOOP
      d := work_days[i];
      st := 'PRESENT';
      hw := 8.0;
      lm := 0;

      IF rec.id % 7 = 0 AND i % 5 = 0 THEN
        st := 'LATE'; lm := 15 + (i%3)* 10;
      ELSIF rec.id % 11 = 0 AND i % 8 = 0 THEN
        st := 'ABSENT'; hw := 0; lm := 0;
      ELSIF rec.id % 5 = 0 AND i % 10 = 0 THEN
        st := 'HALF_DAY'; hw := 4.0;
      ELSIF rec.id % 13 = 0 AND i % 6 = 0 THEN
        st := 'LATE'; lm := 20;
      END IF;

      IF st = 'ABSENT' THEN
        ci := NULL; co := NULL;
      ELSIF st = 'LATE' THEN
        ci := d + interval '9 hours' + (lm || ' minutes')::interval;
        co := d + interval '17 hours' + (lm || ' minutes')::interval;
      ELSIF st = 'HALF_DAY' THEN
        ci := d + interval '9 hours';
        co := d + interval '13 hours';
      ELSE
        ci := d + interval '8 hours 50 minutes' + ((i % 10) || ' minutes')::interval;
        co := d + interval '17 hours 10 minutes' + ((i % 5) || ' minutes')::interval;
      END IF;

      INSERT INTO attendance (user_id, date, clock_in_time, clock_out_time, hours_worked, status, late_minutes)
      VALUES (rec.id, d, ci, co, hw, st, lm);
    END LOOP;
  END LOOP;
END $$;

-- ── 5. Leave requests ───────────────────────────────────────────
INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason, status, approved_by, approved_at, created_at, updated_at) VALUES
  (2,'ANNUAL',   '2025-06-09','2025-06-13',5,'Family vacation to Hawaii',             'APPROVED',1,'2025-06-01 10:00:00',NOW(),NOW()),
  (6,'SICK',     '2025-06-16','2025-06-17',2,'Medical appointment and recovery',       'APPROVED',1,'2025-06-15 09:00:00',NOW(),NOW()),
  (10,'ANNUAL',  '2025-06-23','2025-06-27',5,'Summer break with family',               'APPROVED',1,'2025-06-10 14:00:00',NOW(),NOW()),
  (14,'EMERGENCY','2025-06-04','2025-06-04',1,'Family emergency',                      'APPROVED',1,'2025-06-04 08:30:00',NOW(),NOW()),
  (18,'ANNUAL',  '2025-06-16','2025-06-20',5,'Trip to Japan',                          'APPROVED',1,'2025-06-05 11:00:00',NOW(),NOW()),
  (22,'SICK',    '2025-06-25','2025-06-26',2,'Dental surgery recovery',                'APPROVED',1,'2025-06-24 16:00:00',NOW(),NOW()),
  (3,'ANNUAL',   '2025-07-07','2025-07-11',5,'Visiting relatives overseas',            'PENDING', NULL,NULL,NOW(),NOW()),
  (7,'SICK',     '2025-07-01','2025-07-02',2,'Scheduled surgery',                      'PENDING', NULL,NULL,NOW(),NOW()),
  (11,'MATERNITY','2025-07-14','2025-08-14',30,'Maternity leave',                       'PENDING', NULL,NULL,NOW(),NOW()),
  (15,'ANNUAL',  '2025-07-21','2025-07-25',5,'Wedding anniversary trip',               'PENDING', NULL,NULL,NOW(),NOW()),
  (19,'EMERGENCY','2025-07-03','2025-07-03',1,'Home repair emergency',                  'PENDING', NULL,NULL,NOW(),NOW()),
  (4,'ANNUAL',   '2025-06-09','2025-06-13',5,'Personal travel',                        'REJECTED',1,'2025-06-02 09:00:00',NOW(),NOW()),
  (8,'UNPAID',   '2025-06-23','2025-07-04',10,'Extended personal project',              'REJECTED',1,'2025-06-12 10:00:00',NOW(),NOW()),
  (12,'ANNUAL',  '2025-06-16','2025-06-27',10,'Too many team members on leave',         'REJECTED',1,'2025-06-08 15:00:00',NOW(),NOW());

-- ── 6. Payroll — June 2025 ─────────────────────────────────────
INSERT INTO payroll (user_id, pay_period_start, pay_period_end, base_salary, extra_salary, overtime_hours, overtime_pay, gross_salary, tax_deduction, insurance_deduction, other_deductions, total_deductions, net_salary, status, payment_date) VALUES
  (2, '2025-06-01','2025-06-30',7916.67, 500,10,300, 8716.67,1450,350,100,1900,6816.67,'PAID','2025-07-05'),
  (3, '2025-06-01','2025-06-30',6250.00, 300, 5,125, 6675.00,1050,280, 50,1380,5295.00,'PAID','2025-07-05'),
  (4, '2025-06-01','2025-06-30',6833.33, 400, 8,200, 7433.33,1200,310, 75,1585,5848.33,'PAID','2025-07-05'),
  (5, '2025-06-01','2025-06-30',5833.33, 200, 3, 75, 6108.33, 950,250, 25,1225,4883.33,'PROCESSED',NULL),
  (6, '2025-06-01','2025-06-30',6083.33, 250, 4,100, 6433.33,1000,265, 30,1295,5138.33,'PROCESSED',NULL),
  (7, '2025-06-01','2025-06-30',6500.00, 350, 6,150, 7000.00,1120,290, 60,1470,5530.00,'DRAFT',NULL),
  (8, '2025-06-01','2025-06-30',6666.67, 400, 5,125, 7191.67,1150,300, 50,1500,5691.67,'PAID','2025-07-05'),
  (9, '2025-06-01','2025-06-30',5000.00, 150, 2, 50, 5200.00, 800,220, 20,1040,4160.00,'PAID','2025-07-05'),
  (10,'2025-06-01','2025-06-30',4583.33, 100, 0,  0, 4683.33, 700,200, 15, 915,3768.33,'PROCESSED',NULL),
  (11,'2025-06-01','2025-06-30',4833.33, 200, 3, 75, 5108.33, 780,210, 25,1015,4093.33,'DRAFT',NULL),
  (12,'2025-06-01','2025-06-30',7333.33, 500, 4,100, 7933.33,1300,330, 80,1710,6223.33,'PAID','2025-07-05'),
  (13,'2025-06-01','2025-06-30',5666.67, 300, 3, 75, 6041.67, 950,255, 40,1245,4796.67,'PROCESSED',NULL),
  (14,'2025-06-01','2025-06-30',5166.67, 200, 2, 50, 5416.67, 820,230, 30,1080,4336.67,'DRAFT',NULL),
  (15,'2025-06-01','2025-06-30',6500.00, 350, 3, 75, 6925.00,1100,290, 50,1440,5485.00,'PAID','2025-07-05'),
  (16,'2025-06-01','2025-06-30',4583.33, 150, 1, 25, 4758.33, 720,200, 20, 940,3818.33,'PROCESSED',NULL),
  (17,'2025-06-01','2025-06-30',4166.67, 100, 0,  0, 4266.67, 630,185, 15, 830,3436.67,'DRAFT',NULL),
  (18,'2025-06-01','2025-06-30',7666.67,1000, 5,250, 8916.67,1500,360,100,1960,6956.67,'PAID','2025-07-05'),
  (19,'2025-06-01','2025-06-30',5416.67, 500, 3,125, 6041.67, 950,255, 40,1245,4796.67,'PAID','2025-07-05'),
  (20,'2025-06-01','2025-06-30',4333.33, 200, 2, 50, 4583.33, 680,195, 20, 895,3688.33,'PROCESSED',NULL),
  (21,'2025-06-01','2025-06-30',4666.67, 300, 4,100, 5066.67, 780,210, 30,1020,4046.67,'DRAFT',NULL),
  (22,'2025-06-01','2025-06-30',7083.33, 400, 4,100, 7583.33,1220,315, 60,1595,5988.33,'PAID','2025-07-05'),
  (23,'2025-06-01','2025-06-30',4833.33, 200, 2, 50, 5083.33, 780,210, 25,1015,4068.33,'PROCESSED',NULL),
  (24,'2025-06-01','2025-06-30',5083.33, 250, 3, 75, 5408.33, 830,225, 30,1085,4323.33,'DRAFT',NULL),
  (25,'2025-06-01','2025-06-30',6833.33, 400, 5,125, 7358.33,1180,305, 55,1540,5818.33,'PAID','2025-07-05'),
  (26,'2025-06-01','2025-06-30',5583.33, 250, 2, 50, 5883.33, 900,245, 30,1175,4708.33,'PROCESSED',NULL),
  (27,'2025-06-01','2025-06-30',4500.00, 150, 1, 25, 4675.00, 690,195, 20, 905,3770.00,'DRAFT',NULL),
  (28,'2025-06-01','2025-06-30',8750.00, 600, 2,100, 9450.00,1600,400,100,2100,7350.00,'PAID','2025-07-05'),
  (29,'2025-06-01','2025-06-30',5416.67, 300, 1, 25, 5741.67, 880,240, 35,1155,4586.67,'PROCESSED',NULL),
  (30,'2025-06-01','2025-06-30',6000.00, 350, 4,100, 6450.00,1000,270, 40,1310,5140.00,'PAID','2025-07-05'),
  (31,'2025-06-01','2025-06-30',4000.00, 150, 1, 25, 4175.00, 600,175, 15, 790,3385.00,'DRAFT',NULL);

-- ── 7. Performance Reviews — H1 2025 ────────────────────────────
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, quality_score, productivity_score, communication_score, teamwork_score, punctuality_score, overall_score, feedback, goals, improvements, created_at, updated_at) VALUES
  (2, 1,'2025-01-01','2025-06-30',5,5,4,5,5,4.80,'Exceptional technical leadership. Drove microservices migration ahead of schedule.','Architect the new payment gateway','Consider presenting at a tech conference',NOW(),NOW()),
  (3, 1,'2025-01-01','2025-06-30',4,4,4,4,5,4.20,'Solid contributor. All sprint commitments delivered on time. Great team player.','Own a major feature end-to-end','Improve system design documentation',NOW(),NOW()),
  (4, 1,'2025-01-01','2025-06-30',5,5,3,4,4,4.20,'Outstanding DevOps work. Deployment time reduced 60%. CI/CD reliability significantly improved.','Implement infrastructure-as-code everywhere','Improve cross-team communication during incidents',NOW(),NOW()),
  (5, 1,'2025-01-01','2025-06-30',4,3,5,5,4,4.20,'Creative frontend developer. Users consistently praise the interfaces built.','Lead the design system initiative','Deepen backend knowledge for full-stack capability',NOW(),NOW()),
  (6, 1,'2025-01-01','2025-06-30',4,4,4,3,5,4.00,'Reliable backend developer. API response times improved 30%. Very punctual.','Mentor interns','Participate more in architecture discussions',NOW(),NOW()),
  (7, 1,'2025-01-01','2025-06-30',5,4,4,4,4,4.20,'Excellent QA lead. Bug escape rate dropped 40%. Introduced automated testing best practices.','Achieve 85% automated test coverage','Develop load testing framework',NOW(),NOW()),
  (8, 1,'2025-01-01','2025-06-30',5,5,5,5,4,4.80,'Outstanding marketing leadership. Q2 campaign exceeded targets by 35%.','Develop 2026 marketing strategy roadmap','Explore AI-driven personalization',NOW(),NOW()),
  (9, 1,'2025-01-01','2025-06-30',4,4,5,4,5,4.40,'Creative content strategist. Blog traffic up 120%. Social engagement doubled.','Launch a podcast series','Improve data analytics for content ROI',NOW(),NOW()),
  (10,1,'2025-01-01','2025-06-30',4,5,3,4,5,4.20,'SEO results impressive — organic traffic up 80%. Very data-driven approach.','Expand SEO to international markets','Improve content writing skills',NOW(),NOW()),
  (11,1,'2025-01-01','2025-06-30',4,4,4,5,4,4.20,'Great social media presence. Follower growth 200%. Engagement above industry average.','Launch influencer partnership program','Develop video content strategy',NOW(),NOW()),
  (12,1,'2025-01-01','2025-06-30',5,5,4,4,5,4.60,'Excellent financial management. Zero audit findings. Forecasting accuracy at 98%.','Implement rolling forecast model','Mentor junior finance team members',NOW(),NOW()),
  (13,1,'2025-01-01','2025-06-30',4,5,3,4,5,4.20,'Thorough accountant. Month-end close reduced by 2 days. Very reliable.','Pursue CPA certification','Improve presentation skills for financial reports',NOW(),NOW()),
  (14,1,'2025-01-01','2025-06-30',4,4,4,3,5,4.00,'Strong analytical skills. Financial models instrumental in strategic decisions.','Lead the annual budgeting process','Develop financial planning software expertise',NOW(),NOW()),
  (15,1,'2025-01-01','2025-06-30',5,4,5,5,4,4.60,'Exceptional HR leadership. Employee satisfaction up 15%. Managed 45 hires.','Implement employee wellness program','Develop succession planning framework',NOW(),NOW()),
  (16,1,'2025-01-01','2025-06-30',4,5,4,4,5,4.40,'Talented recruiter. Time-to-fill reduced 30%. Great candidate experience.','Build employer branding strategy','Improve diversity hiring metrics',NOW(),NOW()),
  (17,1,'2025-01-01','2025-06-30',4,4,4,5,5,4.40,'Organized HR coordinator. Onboarding streamlined. Employees feel well-supported.','Lead HRIS optimization project','Develop conflict resolution skills',NOW(),NOW()),
  (18,1,'2025-01-01','2025-06-30',5,5,5,4,4,4.60,'Outstanding sales leadership. Team exceeded quota 25%. Closed largest company deal.','Expand into APAC market','Develop strategic partnership program',NOW(),NOW()),
  (19,1,'2025-01-01','2025-06-30',4,5,4,4,5,4.40,'Top account executive. 130% of quota. Client retention 95%.','Move into team lead role','Improve CRM data hygiene',NOW(),NOW()),
  (20,1,'2025-01-01','2025-06-30',3,4,4,4,5,4.00,'Promising sales rep. Pipeline growing. Needs to improve closing techniques.','Achieve 100% quota in Q3','Attend advanced negotiation training',NOW(),NOW()),
  (21,1,'2025-01-01','2025-06-30',4,4,5,4,4,4.20,'Strong BD skills. 50+ qualified leads. Great at building relationships.','Improve lead-to-close conversion','Develop industry-specific expertise',NOW(),NOW()),
  (22,1,'2025-01-01','2025-06-30',5,5,4,5,4,4.60,'Excellent ops management. Cost reduction 12% while maintaining quality.','Implement lean manufacturing principles','Develop vendor management scorecards',NOW(),NOW()),
  (23,1,'2025-01-01','2025-06-30',4,4,4,5,5,4.40,'Reliable logistics coordinator. On-time delivery at 98%.','Optimize warehouse layout','Learn data analytics for logistics',NOW(),NOW()),
  (24,1,'2025-01-01','2025-06-30',4,5,3,4,5,4.20,'Sharp supply chain analyst. Inventory optimization saved $200K.','Lead supplier diversity initiative','Improve presentation of supply chain insights',NOW(),NOW()),
  (25,1,'2025-01-01','2025-06-30',5,5,4,5,4,4.60,'Exceptional UX leadership. User satisfaction up 25%. Design system at 100% adoption.','Establish design ops function','Conduct user research for mobile experience',NOW(),NOW()),
  (26,1,'2025-01-01','2025-06-30',4,4,4,4,5,4.20,'Talented UI designer. Component library contributions invaluable.','Lead accessibility improvement initiative','Develop motion design skills',NOW(),NOW()),
  (27,1,'2025-01-01','2025-06-30',4,3,5,5,4,4.20,'Creative graphic designer. Marketing materials quality significantly improved.','Build brand asset management system','Improve video editing capabilities',NOW(),NOW()),
  (28,1,'2025-01-01','2025-06-30',5,5,5,4,5,4.80,'Outstanding legal counsel. Zero compliance issues. Contract negotiation saved $500K.','Develop IP protection strategy','Implement legal tech automation',NOW(),NOW()),
  (29,1,'2025-01-01','2025-06-30',4,4,4,4,5,4.20,'Thorough legal analyst. Contract review turnaround improved 50%.','Specialize in employment law','Improve legal writing for executive summaries',NOW(),NOW()),
  (30,1,'2025-01-01','2025-06-30',5,4,5,5,4,4.60,'Excellent support leadership. CSAT at all-time high 96%.','Implement AI-assisted ticket routing','Develop customer health scoring model',NOW(),NOW()),
  (31,1,'2025-01-01','2025-06-30',4,4,5,5,5,4.60,'Empathetic support specialist. First-contact resolution 85%. Customers praise by name.','Mentor new support team members','Develop technical troubleshooting expertise',NOW(),NOW());

COMMIT;
