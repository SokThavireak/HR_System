package com.hrms.config;

import com.hrms.entity.User;
import com.hrms.entity.Role;
import com.hrms.entity.Role.RoleName;
import com.hrms.repository.UserRepository;
import com.hrms.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsers() {
        return args -> {
            // Only seed if no employees exist (admin may exist)
            if (userRepo.count() > 1) {
                System.out.println("[DataSeeder] Users already exist — skipping seed");
                return;
            }

            Role employeeRole = roleRepo.findByName(RoleName.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("ROLE_EMPLOYEE not found — did tables get created?"));

            String hash = passwordEncoder.encode("changeme");

            Object[][] employees = {
                {"sophia.chen@hrms.local",    "Sophia",   "Chen",     "+1-555-0201","Engineering",  "Senior Software Engineer", 95000, "2023-01-09"},
                {"marcus.johnson@hrms.local", "Marcus",   "Johnson",  "+1-555-0202","Engineering",  "Software Engineer",        75000, "2023-04-17"},
                {"priya.patel@hrms.local",    "Priya",    "Patel",    "+1-555-0203","Engineering",  "DevOps Engineer",          82000, "2023-07-24"},
                {"david.kim@hrms.local",      "David",    "Kim",      "+1-555-0204","Engineering",  "Frontend Developer",       70000, "2024-01-15"},
                {"aisha.ahmed@hrms.local",    "Aisha",    "Ahmed",    "+1-555-0205","Engineering",  "Backend Developer",        73000, "2024-02-20"},
                {"carlos.reyes@hrms.local",   "Carlos",   "Reyes",    "+1-555-0206","Engineering",  "QA Lead",                  78000, "2023-09-05"},
                {"emily.wang@hrms.local",     "Emily",    "Wang",     "+1-555-0207","Marketing",     "Marketing Manager",        80000, "2022-11-01"},
                {"james.martin@hrms.local",   "James",    "Martin",   "+1-555-0208","Marketing",     "Content Strategist",       60000, "2023-06-12"},
                {"olga.smirnova@hrms.local",  "Olga",     "Smirnova", "+1-555-0209","Marketing",     "SEO Specialist",           55000, "2024-03-01"},
                {"raj.gupta@hrms.local",      "Raj",      "Gupta",    "+1-555-0210","Marketing",     "Social Media Manager",     58000, "2024-05-20"},
                {"lisa.thompson@hrms.local",  "Lisa",     "Thompson", "+1-555-0211","Finance",       "Finance Manager",          88000, "2022-08-15"},
                {"mohammed.ali@hrms.local",   "Mohammed", "Ali",      "+1-555-0212","Finance",       "Senior Accountant",        68000, "2023-02-10"},
                {"fatima.hassan@hrms.local",  "Fatima",   "Hassan",   "+1-555-0213","Finance",       "Financial Analyst",        62000, "2023-11-20"},
                {"anna.mueller@hrms.local",   "Anna",     "Mueller",  "+1-555-0214","Human Resources","HR Manager",              78000, "2022-06-01"},
                {"kevin.brown@hrms.local",    "Kevin",    "Brown",    "+1-555-0215","Human Resources","Recruiter",               55000, "2023-08-14"},
                {"nguyen.tran@hrms.local",    "Nguyen",   "Tran",     "+1-555-0216","Human Resources","HR Coordinator",          50000, "2024-01-30"},
                {"robert.wilson@hrms.local",  "Robert",   "Wilson",   "+1-555-0217","Sales",         "Sales Director",           92000, "2022-04-10"},
                {"sara.dupont@hrms.local",    "Sara",     "Dupont",   "+1-555-0218","Sales",         "Account Executive",        65000, "2023-03-22"},
                {"daniel.lee@hrms.local",     "Daniel",   "Lee",      "+1-555-0219","Sales",         "Sales Representative",     52000, "2024-02-05"},
                {"mei.lin@hrms.local",        "Mei",      "Lin",      "+1-555-0220","Sales",         "Business Development Rep", 56000, "2024-07-01"},
                {"peter.jones@hrms.local",    "Peter",    "Jones",    "+1-555-0221","Operations",    "Operations Manager",       85000, "2022-09-15"},
                {"linda.zhang@hrms.local",    "Linda",    "Zhang",    "+1-555-0222","Operations",    "Logistics Coordinator",    58000, "2023-05-10"},
                {"omar.farouk@hrms.local",    "Omar",     "Farouk",   "+1-555-0223","Operations",    "Supply Chain Analyst",     61000, "2023-10-01"},
                {"isabella.rossi@hrms.local", "Isabella", "Rossi",    "+1-555-0224","Design",        "Lead UX Designer",         82000, "2022-12-01"},
                {"tom.harris@hrms.local",     "Tom",      "Harris",   "+1-555-0225","Design",        "UI Designer",              67000, "2023-07-15"},
                {"nadia.petrova@hrms.local",  "Nadia",    "Petrova",  "+1-555-0226","Design",        "Graphic Designer",         54000, "2024-04-10"},
                {"william.scott@hrms.local",  "William",  "Scott",    "+1-555-0227","Legal",         "General Counsel",          105000,"2022-01-20"},
                {"claire.dubois@hrms.local",  "Claire",   "Dubois",   "+1-555-0228","Legal",         "Legal Analyst",            65000, "2023-09-01"},
                {"alex.morgan@hrms.local",    "Alex",     "Morgan",   "+1-555-0229","Customer Support","Support Manager",        72000, "2022-10-15"},
                {"jenny.adams@hrms.local",    "Jenny",    "Adams",    "+1-555-0230","Customer Support","Support Specialist",      48000, "2023-12-01"},
            };

            for (Object[] e : employees) {
                User user = User.builder()
                    .email((String) e[0])
                    .password(hash)
                    .firstName((String) e[1])
                    .lastName((String) e[2])
                    .phone((String) e[3])
                    .department((String) e[4])
                    .position((String) e[5])
                    .baseSalary(BigDecimal.valueOf((Integer) e[6]))
                    .hireDate(LocalDate.parse((String) e[7]))
                    .active(true)
                    .roles(new HashSet<>(Set.of(employeeRole)))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                userRepo.save(user);
            }

            System.out.println("[DataSeeder] Seeded " + employees.length + " employees");
        };
    }
}
