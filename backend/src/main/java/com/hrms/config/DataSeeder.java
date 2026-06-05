package com.hrms.config;

import com.hrms.entity.*;
import com.hrms.entity.Attendance.AttendanceStatus;
import com.hrms.entity.LeaveRequest.LeaveStatus;
import com.hrms.entity.LeaveRequest.LeaveType;
import com.hrms.entity.Payroll.PayrollStatus;
import com.hrms.entity.Role.RoleName;
import com.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository deptRepo;
    private final PositionRepository posRepo;
    private final AttendanceRepository attendanceRepo;
    private final LeaveRequestRepository leaveRepo;
    private final PayrollRepository payrollRepo;
    private final PerformanceReviewRepository reviewRepo;

    @Bean
    CommandLineRunner seedDatabase() {
        return args -> {
            if (userRepo.count() > 1) {
                System.out.println("[DataSeeder] Data already exists — skipping seed");
                return;
            }

            Role employeeRole = roleRepo.findByName(RoleName.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("ROLE_EMPLOYEE not found"));
            Role adminRole = roleRepo.findByName(RoleName.ROLE_HR_ADMIN).orElse(null);

            String hash = passwordEncoder.encode("changeme");

            // ── 1. Seed Departments ──
            String[][] deptData = {
                {"Engineering", "Software development, DevOps, and QA"},
                {"Marketing", "Brand, content, SEO, and social media"},
                {"Finance", "Accounting, payroll, and financial planning"},
                {"Human Resources", "Recruitment, employee relations, and HR ops"},
                {"Sales", "Revenue generation and client relations"},
                {"Operations", "Logistics, supply chain, and facilities"},
                {"Design", "UX/UI, graphic design, and brand identity"},
                {"Legal", "Compliance, contracts, and legal counsel"},
                {"Customer Support", "Customer success and technical support"},
            };
            Map<Integer, Department> departments = new HashMap<>();
            for (int i = 0; i < deptData.length; i++) {
                Department d = deptRepo.save(Department.builder()
                    .name(deptData[i][0])
                    .description(deptData[i][1])
                    .build());
                departments.put(i + 1, d);
            }
            System.out.println("[DataSeeder] Seeded " + departments.size() + " departments");

            // ── 2. Seed Positions ──
            Object[][] posData = {
                {"Senior Software Engineer", "Lead developer for core platform", 1, 90000, 120000},
                {"Software Engineer", "Full-stack development", 1, 65000, 90000},
                {"DevOps Engineer", "CI/CD and infrastructure", 1, 70000, 100000},
                {"Frontend Developer", "React/UI development", 1, 60000, 85000},
                {"Backend Developer", "API and service development", 1, 62000, 88000},
                {"QA Lead", "Quality assurance and test automation", 1, 68000, 95000},
                {"Marketing Manager", "Marketing strategy and campaigns", 2, 70000, 95000},
                {"Content Strategist", "Content planning and creation", 2, 50000, 70000},
                {"SEO Specialist", "Search engine optimization", 2, 48000, 65000},
                {"Social Media Manager", "Social media presence", 2, 48000, 68000},
                {"Finance Manager", "Financial planning and oversight", 3, 78000, 110000},
                {"Senior Accountant", "General ledger and reporting", 3, 58000, 78000},
                {"Financial Analyst", "Budget analysis and forecasting", 3, 52000, 72000},
                {"HR Manager", "HR strategy and people operations", 4, 68000, 95000},
                {"Recruiter", "Talent acquisition and hiring", 4, 48000, 65000},
                {"HR Coordinator", "Onboarding and HR administration", 4, 42000, 58000},
                {"Sales Director", "Sales strategy and team leadership", 5, 80000, 120000},
                {"Account Executive", "Key account management", 5, 55000, 80000},
                {"Sales Representative", "New business development", 5, 45000, 65000},
                {"Business Development Rep", "Lead generation and prospecting", 5, 48000, 68000},
                {"Operations Manager", "Operations oversight and optimization", 6, 72000, 100000},
                {"Logistics Coordinator", "Supply chain and logistics", 6, 48000, 68000},
                {"Supply Chain Analyst", "Inventory and supply optimization", 6, 50000, 72000},
                {"Lead UX Designer", "User experience and design systems", 7, 70000, 100000},
                {"UI Designer", "Interface design and prototyping", 7, 55000, 78000},
                {"Graphic Designer", "Visual design and brand assets", 7, 45000, 65000},
                {"General Counsel", "Legal strategy and compliance", 8, 90000, 140000},
                {"Legal Analyst", "Contract review and legal research", 8, 55000, 78000},
                {"Support Manager", "Support team leadership", 9, 60000, 85000},
                {"Support Specialist", "Customer issue resolution", 9, 40000, 58000},
            };
            Map<Integer, Position> positions = new HashMap<>();
            for (int i = 0; i < posData.length; i++) {
                Position p = posRepo.save(Position.builder()
                    .title((String) posData[i][0])
                    .description((String) posData[i][1])
                    .department(departments.get((int) posData[i][2]))
                    .minSalary(BigDecimal.valueOf((int) posData[i][3]))
                    .maxSalary(BigDecimal.valueOf((int) posData[i][4]))
                    .build());
                positions.put(i + 1, p);
            }
            System.out.println("[DataSeeder] Seeded " + positions.size() + " positions");

            // ── 3. Seed Users (30 employees) ──
            Object[][] empData = {
                {"sophia.chen@hrms.local",    "Sophia",   "Chen",     "+1-555-0201", 1, 1, 95000, "2023-01-09"},
                {"marcus.johnson@hrms.local", "Marcus",   "Johnson",  "+1-555-0202", 1, 2, 75000, "2023-04-17"},
                {"priya.patel@hrms.local",    "Priya",    "Patel",    "+1-555-0203", 1, 3, 82000, "2023-07-24"},
                {"david.kim@hrms.local",      "David",    "Kim",      "+1-555-0204", 1, 4, 70000, "2024-01-15"},
                {"aisha.ahmed@hrms.local",    "Aisha",    "Ahmed",    "+1-555-0205", 1, 5, 73000, "2024-02-20"},
                {"carlos.reyes@hrms.local",   "Carlos",   "Reyes",    "+1-555-0206", 1, 6, 78000, "2023-09-05"},
                {"emily.wang@hrms.local",     "Emily",    "Wang",     "+1-555-0207", 2, 7, 80000, "2022-11-01"},
                {"james.martin@hrms.local",   "James",    "Martin",   "+1-555-0208", 2, 8, 60000, "2023-06-12"},
                {"olga.smirnova@hrms.local",  "Olga",     "Smirnova", "+1-555-0209", 2, 9, 55000, "2024-03-01"},
                {"raj.gupta@hrms.local",      "Raj",      "Gupta",    "+1-555-0210", 2, 10, 58000, "2024-05-20"},
                {"lisa.thompson@hrms.local",  "Lisa",     "Thompson", "+1-555-0211", 3, 11, 88000, "2022-08-15"},
                {"mohammed.ali@hrms.local",   "Mohammed", "Ali",      "+1-555-0212", 3, 12, 68000, "2023-02-10"},
                {"fatima.hassan@hrms.local",  "Fatima",   "Hassan",   "+1-555-0213", 3, 13, 62000, "2023-11-20"},
                {"anna.mueller@hrms.local",   "Anna",     "Mueller",  "+1-555-0214", 4, 14, 78000, "2022-06-01"},
                {"kevin.brown@hrms.local",    "Kevin",    "Brown",    "+1-555-0215", 4, 15, 55000, "2023-08-14"},
                {"nguyen.tran@hrms.local",    "Nguyen",   "Tran",     "+1-555-0216", 4, 16, 50000, "2024-01-30"},
                {"robert.wilson@hrms.local",  "Robert",   "Wilson",   "+1-555-0217", 5, 17, 92000, "2022-04-10"},
                {"sara.dupont@hrms.local",    "Sara",     "Dupont",   "+1-555-0218", 5, 18, 65000, "2023-03-22"},
                {"daniel.lee@hrms.local",     "Daniel",   "Lee",      "+1-555-0219", 5, 19, 52000, "2024-02-05"},
                {"mei.lin@hrms.local",        "Mei",      "Lin",      "+1-555-0220", 5, 20, 56000, "2024-07-01"},
                {"peter.jones@hrms.local",    "Peter",    "Jones",    "+1-555-0221", 6, 21, 85000, "2022-09-15"},
                {"linda.zhang@hrms.local",    "Linda",    "Zhang",    "+1-555-0222", 6, 22, 58000, "2023-05-10"},
                {"omar.farouk@hrms.local",    "Omar",     "Farouk",   "+1-555-0223", 6, 23, 61000, "2023-10-01"},
                {"isabella.rossi@hrms.local", "Isabella", "Rossi",    "+1-555-0224", 7, 24, 82000, "2022-12-01"},
                {"tom.harris@hrms.local",     "Tom",      "Harris",   "+1-555-0225", 7, 25, 67000, "2023-07-15"},
                {"nadia.petrova@hrms.local",  "Nadia",    "Petrova",  "+1-555-0226", 7, 26, 54000, "2024-04-10"},
                {"william.scott@hrms.local",  "William",  "Scott",    "+1-555-0227", 8, 27, 105000,"2022-01-20"},
                {"claire.dubois@hrms.local",  "Claire",   "Dubois",   "+1-555-0228", 8, 28, 65000, "2023-09-01"},
                {"alex.morgan@hrms.local",    "Alex",     "Morgan",   "+1-555-0229", 9, 29, 72000, "2022-10-15"},
                {"jenny.adams@hrms.local",    "Jenny",    "Adams",    "+1-555-0230", 9, 30, 48000, "2023-12-01"},
            };

            List<User> users = new ArrayList<>();
            for (Object[] e : empData) {
                int deptIdx = (int) e[4];
                int posIdx = (int) e[5];
                User user = User.builder()
                    .email((String) e[0])
                    .password(hash)
                    .firstName((String) e[1])
                    .lastName((String) e[2])
                    .phone((String) e[3])
                    .department(deptData[deptIdx - 1][0])
                    .position((String) posData[posIdx - 1][0])
                    .baseSalary(BigDecimal.valueOf((Integer) e[6]))
                    .hireDate(LocalDate.parse((String) e[7]))
                    .active(true)
                    .roles(new HashSet<>(Set.of(employeeRole)))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                users.add(userRepo.save(user));
            }
            System.out.println("[DataSeeder] Seeded " + users.size() + " employees");

            // ── 4. Seed Attendance (June 2025, 21 work days) ──
            LocalDate[] workDays = {
                LocalDate.of(2025,6,2), LocalDate.of(2025,6,3), LocalDate.of(2025,6,4), LocalDate.of(2025,6,5), LocalDate.of(2025,6,6),
                LocalDate.of(2025,6,9), LocalDate.of(2025,6,10), LocalDate.of(2025,6,11), LocalDate.of(2025,6,12), LocalDate.of(2025,6,13),
                LocalDate.of(2025,6,16), LocalDate.of(2025,6,17), LocalDate.of(2025,6,18), LocalDate.of(2025,6,19), LocalDate.of(2025,6,20),
                LocalDate.of(2025,6,23), LocalDate.of(2025,6,24), LocalDate.of(2025,6,25), LocalDate.of(2025,6,26), LocalDate.of(2025,6,27),
                LocalDate.of(2025,6,30)
            };

            List<Attendance> attendances = new ArrayList<>();
            Random rng = new Random(42);
            for (User u : users) {
                for (int d = 0; d < workDays.length; d++) {
                    LocalDate date = workDays[d];
                    int roll = rng.nextInt(100);
                    AttendanceStatus status;
                    double hours;
                    int lateMin;
                    LocalDateTime clockIn;
                    LocalDateTime clockOut;

                    if (roll < 5) {
                        status = AttendanceStatus.ABSENT;
                        hours = 0;
                        lateMin = 0;
                        clockIn = null;
                        clockOut = null;
                    } else if (roll < 15) {
                        status = AttendanceStatus.LATE;
                        lateMin = 10 + rng.nextInt(35);
                        clockIn = LocalDateTime.of(date, LocalTime.of(9, lateMin));
                        clockOut = LocalDateTime.of(date, LocalTime.of(17, 10 + rng.nextInt(20)));
                        hours = 8.0 - (lateMin / 60.0);
                    } else if (roll < 20) {
                        status = AttendanceStatus.HALF_DAY;
                        hours = 4.0;
                        lateMin = 0;
                        clockIn = LocalDateTime.of(date, LocalTime.of(9, 0));
                        clockOut = LocalDateTime.of(date, LocalTime.of(13, 0));
                    } else {
                        status = AttendanceStatus.PRESENT;
                        hours = 8.0 + rng.nextDouble() * 0.5;
                        lateMin = 0;
                        clockIn = LocalDateTime.of(date, LocalTime.of(8, 45 + rng.nextInt(15)));
                        clockOut = LocalDateTime.of(date, LocalTime.of(17, 5 + rng.nextInt(25)));
                    }

                    double ot = Math.max(0, hours - 8.0);
                    attendances.add(Attendance.builder()
                        .user(u)
                        .date(date)
                        .clockInTime(clockIn)
                        .clockOutTime(clockOut)
                        .status(status)
                        .hoursWorked(Math.round(hours * 100.0) / 100.0)
                        .overtimeHours(Math.round(ot * 100.0) / 100.0)
                        .lateMinutes(lateMin)
                        .build());
                }
            }
            attendanceRepo.saveAll(attendances);
            System.out.println("[DataSeeder] Seeded " + attendances.size() + " attendance records");

            // ── 5. Seed Leave Requests ──
            User adminUser = userRepo.findByEmail("admin@hrms.local").orElse(users.get(0));
            Object[][] leaveData = {
                {0, LeaveType.ANNUAL, LocalDate.of(2025,6,9), LocalDate.of(2025,6,13), 5, "Family vacation to Hawaii", LeaveStatus.APPROVED},
                {5, LeaveType.SICK, LocalDate.of(2025,6,16), LocalDate.of(2025,6,17), 2, "Medical appointment and recovery", LeaveStatus.APPROVED},
                {9, LeaveType.ANNUAL, LocalDate.of(2025,6,23), LocalDate.of(2025,6,27), 5, "Summer break with family", LeaveStatus.APPROVED},
                {15, LeaveType.EMERGENCY, LocalDate.of(2025,6,4), LocalDate.of(2025,6,4), 1, "Family emergency", LeaveStatus.APPROVED},
                {25, LeaveType.ANNUAL, LocalDate.of(2025,6,16), LocalDate.of(2025,6,20), 5, "Trip to Japan", LeaveStatus.APPROVED},
                {28, LeaveType.SICK, LocalDate.of(2025,6,25), LocalDate.of(2025,6,26), 2, "Dental surgery recovery", LeaveStatus.APPROVED},
                {1, LeaveType.ANNUAL, LocalDate.of(2025,7,7), LocalDate.of(2025,7,11), 5, "Visiting relatives overseas", LeaveStatus.PENDING},
                {10, LeaveType.SICK, LocalDate.of(2025,7,1), LocalDate.of(2025,7,2), 2, "Scheduled surgery", LeaveStatus.PENDING},
                {17, LeaveType.MATERNITY, LocalDate.of(2025,7,14), LocalDate.of(2025,8,14), 30, "Maternity leave", LeaveStatus.PENDING},
                {22, LeaveType.ANNUAL, LocalDate.of(2025,7,21), LocalDate.of(2025,7,25), 5, "Wedding anniversary trip", LeaveStatus.PENDING},
                {26, LeaveType.EMERGENCY, LocalDate.of(2025,7,3), LocalDate.of(2025,7,3), 1, "Home repair emergency", LeaveStatus.PENDING},
                {6, LeaveType.ANNUAL, LocalDate.of(2025,6,9), LocalDate.of(2025,6,13), 5, "Personal travel", LeaveStatus.REJECTED},
                {13, LeaveType.UNPAID, LocalDate.of(2025,6,23), LocalDate.of(2025,7,4), 10, "Extended personal project", LeaveStatus.REJECTED},
                {23, LeaveType.ANNUAL, LocalDate.of(2025,6,16), LocalDate.of(2025,6,27), 10, "Too many team members on leave", LeaveStatus.REJECTED},
            };
            List<LeaveRequest> leaves = new ArrayList<>();
            for (Object[] l : leaveData) {
                User u = users.get((int) l[0]);
                LeaveStatus ls = (LeaveStatus) l[6];
                LeaveRequest lr = LeaveRequest.builder()
                    .user(u)
                    .leaveType((LeaveType) l[1])
                    .startDate((LocalDate) l[2])
                    .endDate((LocalDate) l[3])
                    .totalDays((Integer) l[4])
                    .reason((String) l[5])
                    .status(ls)
                    .createdAt(LocalDateTime.now().minusDays(30))
                    .build();
                if (ls == LeaveStatus.APPROVED) {
                    lr.setApprovedBy(adminUser);
                    lr.setApprovedAt(LocalDateTime.now().minusDays(15));
                } else if (ls == LeaveStatus.REJECTED) {
                    lr.setApprovedBy(adminUser);
                    lr.setApprovedAt(LocalDateTime.now().minusDays(10));
                    lr.setRejectionReason("Insufficient coverage");
                }
                leaves.add(lr);
            }
            leaveRepo.saveAll(leaves);
            System.out.println("[DataSeeder] Seeded " + leaves.size() + " leave requests");

            // ── 6. Seed Payroll (June 2025) ──
            LocalDate periodStart = LocalDate.of(2025, 6, 1);
            LocalDate periodEnd = LocalDate.of(2025, 6, 30);
            int[] extras = {500, 300, 400, 200, 250, 350, 400, 150, 100, 200, 500, 300, 200, 350, 150, 100, 1000, 500, 200, 300, 400, 200, 250, 400, 250, 150, 600, 300, 350, 150};
            int[] otHoursArr = {10, 5, 8, 3, 4, 6, 5, 2, 0, 3, 4, 3, 2, 3, 1, 0, 5, 3, 2, 4, 4, 2, 3, 5, 2, 1, 2, 1, 4, 1};
            int[] others = {100, 50, 75, 25, 30, 60, 50, 20, 15, 25, 80, 40, 30, 50, 20, 15, 100, 40, 20, 30, 60, 25, 30, 55, 30, 20, 100, 35, 40, 15};
            PayrollStatus[] payrollStatuses = {PayrollStatus.PAID, PayrollStatus.PAID, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.DRAFT, PayrollStatus.PAID, PayrollStatus.PROCESSED, PayrollStatus.PAID, PayrollStatus.DRAFT};

            List<Payroll> payrolls = new ArrayList<>();
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                BigDecimal base = u.getBaseSalary().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
                BigDecimal extra = BigDecimal.valueOf(extras[i]);
                BigDecimal hourlyRate = base.divide(BigDecimal.valueOf(160), 2, RoundingMode.HALF_UP);
                BigDecimal otPay = hourlyRate.multiply(BigDecimal.valueOf(1.5)).multiply(BigDecimal.valueOf(otHoursArr[i])).setScale(2, RoundingMode.HALF_UP);
                BigDecimal gross = base.add(extra).add(otPay);
                BigDecimal tax = gross.multiply(BigDecimal.valueOf(0.15)).setScale(2, RoundingMode.HALF_UP);
                BigDecimal insurance = gross.multiply(BigDecimal.valueOf(0.04)).setScale(2, RoundingMode.HALF_UP);
                BigDecimal otherDed = BigDecimal.valueOf(others[i]);
                BigDecimal totalDed = tax.add(insurance).add(otherDed);
                BigDecimal net = gross.subtract(totalDed);
                BigDecimal lateDed = (i % 4 == 0) ? BigDecimal.valueOf(25) : BigDecimal.ZERO;

                payrolls.add(Payroll.builder()
                    .user(u)
                    .payPeriodStart(periodStart)
                    .payPeriodEnd(periodEnd)
                    .baseSalary(base)
                    .fullTimeWorkHours(160.0)
                    .actualWorkHours(160.0 + otHoursArr[i] - (i % 3 == 0 ? 2 : 0))
                    .overtimeHours((double) otHoursArr[i])
                    .overtimePay(otPay)
                    .extraSalary(extra)
                    .lateDeduction(lateDed)
                    .lateMinutes(i % 4 == 0 ? 15 : 0)
                    .taxDeduction(tax)
                    .insuranceDeduction(insurance)
                    .otherDeductions(otherDed)
                    .grossSalary(gross)
                    .totalDeductions(totalDed)
                    .netSalary(net)
                    .status(payrollStatuses[i])
                    .paymentDate(payrollStatuses[i] == PayrollStatus.PAID ? LocalDate.of(2025, 7, 5) : null)
                    .build());
            }
            payrollRepo.saveAll(payrolls);
            System.out.println("[DataSeeder] Seeded " + payrolls.size() + " payroll records");

            // ── 7. Seed Performance Reviews (H1 2025) ──
            double[] overallScores = {4.8, 4.2, 4.2, 4.2, 4.0, 4.2, 4.8, 4.4, 4.2, 4.2, 4.6, 4.2, 4.0, 4.6, 4.4, 4.4, 4.6, 4.4, 4.0, 4.2, 4.6, 4.4, 4.2, 4.6, 4.2, 4.2, 4.8, 4.2, 4.6, 4.6};
            String[] feedbacks = {
                "Exceptional technical leadership. Drove the microservices migration ahead of schedule.",
                "Solid contributor. Delivered all sprint commitments on time. Great team player.",
                "Outstanding DevOps work. Reduced deployment time by 60%.",
                "Creative frontend developer with excellent UI sensibility.",
                "Reliable backend developer. API response times improved 30%.",
                "Excellent QA lead. Bug escape rate dropped 40%.",
                "Outstanding marketing leadership. Q2 campaign exceeded targets by 35%.",
                "Creative content strategist. Blog traffic increased 120%.",
                "SEO results are impressive — organic traffic up 80%.",
                "Great social media presence built. Follower growth of 200%.",
                "Excellent financial management. Audit findings reduced to zero.",
                "Thorough and accurate accountant. Month-end close time reduced.",
                "Strong analytical skills. Financial models built have been instrumental.",
                "Exceptional HR leadership. Employee satisfaction scores up 15%.",
                "Talented recruiter. Time-to-fill reduced by 30%.",
                "Organized and dependable HR coordinator. Onboarding process streamlined.",
                "Outstanding sales leadership. Team exceeded quota by 25%.",
                "Top-performing account executive. 130% of quota achieved.",
                "Promising sales rep with strong work ethic.",
                "Strong business development skills. Generated 50+ qualified leads.",
                "Excellent operations management. Cost reduction of 12% achieved.",
                "Reliable logistics coordinator. On-time delivery rate at 98%.",
                "Sharp supply chain analyst. Inventory optimization saved $200K.",
                "Exceptional UX leadership. User satisfaction scores up 25%.",
                "Talented UI designer with great eye for detail.",
                "Creative graphic designer. Marketing materials quality improved.",
                "Outstanding legal counsel. Zero compliance issues.",
                "Thorough legal analyst. Contract review turnaround improved by 50%.",
                "Excellent support leadership. CSAT scores at all-time high of 96%.",
                "Empathetic and skilled support specialist. First-contact resolution rate of 85%.",
            };
            String[] goals = {
                "Architect the new payment gateway system",
                "Take ownership of a major feature end-to-end",
                "Implement infrastructure-as-code for all environments",
                "Lead the design system initiative",
                "Take on a mentoring role for interns",
                "Achieve 85% automated test coverage",
                "Develop the 2026 marketing strategy roadmap",
                "Launch a podcast series",
                "Expand SEO strategy to international markets",
                "Launch influencer partnership program",
                "Implement rolling forecast model",
                "Pursue CPA certification",
                "Lead the annual budgeting process",
                "Implement employee wellness program",
                "Build employer branding strategy",
                "Lead the HRIS optimization project",
                "Expand into the APAC market",
                "Move into a team lead role",
                "Achieve 100% of quota in Q3",
                "Improve lead-to-close conversion rate",
                "Implement lean manufacturing principles",
                "Optimize warehouse layout",
                "Lead supplier diversity initiative",
                "Establish design ops function",
                "Lead the accessibility improvement initiative",
                "Build a brand asset management system",
                "Develop IP protection strategy",
                "Specialize in employment law",
                "Implement AI-assisted ticket routing",
                "Mentor new support team members",
            };

            List<PerformanceReview> reviews = new ArrayList<>();
            LocalDate reviewStart = LocalDate.of(2025, 1, 1);
            LocalDate reviewEnd = LocalDate.of(2025, 6, 30);
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                int q = 4 + (i % 3 == 0 ? 1 : 0);
                int p = 4 + (i % 4 == 0 ? 1 : 0);
                int c = 3 + (i % 3 == 0 ? 2 : 1);
                int t = 4 + (i % 5 == 0 ? 1 : 0);
                int pu = 4 + (i % 7 == 0 ? 1 : 0);
                reviews.add(PerformanceReview.builder()
                    .employee(u)
                    .reviewer(adminUser)
                    .reviewPeriodStart(reviewStart)
                    .reviewPeriodEnd(reviewEnd)
                    .qualityScore(q)
                    .productivityScore(p)
                    .communicationScore(c)
                    .teamworkScore(t)
                    .punctualityScore(pu)
                    .overallScore(overallScores[i])
                    .feedback(feedbacks[i])
                    .goals(goals[i])
                    .createdAt(LocalDateTime.now().minusDays(60))
                    .build());
            }
            reviewRepo.saveAll(reviews);
            System.out.println("[DataSeeder] Seeded " + reviews.size() + " performance reviews");

            System.out.println("[DataSeeder] ✅ All seed data complete!");
        };
    }
}
