# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HRMS (Human Resources Management System) — a full-stack Java/React application for managing employees, attendance, leave, payroll, and performance reviews.

**Backend:** Java 17, Spring Boot 3.3.4, Spring Security + JWT, Spring Data JPA (Hibernate), PostgreSQL
**Frontend:** React 18 (Create React App), Tailwind CSS, Axios

---

## Rules

ALWAYS befores making any change. Search on the web for newst documentation. And only implement if you are 100% sure it will work.

## Running the Application

### Backend

```bash
cd "C:\Users\SOK THAVIREAK\Desktop\HR System\backend"
mvn compile          # Compile
mvn spring-boot:run  # Run on port 8081
mvn package          # Build JAR
mvn test             # Run tests
```

### Frontend

```bash
cd "C:\Users\SOK THAVIREAK\Desktop\HR System\frontend"
npm install          # Install dependencies
npm start            # Dev server on http://localhost:3000 (proxies API to :8081)
npm run build        # Production build
```

### Database

- PostgreSQL database `hr_system` on `127.0.0.1:5432`, user `postgres`, password `051126`
- Hibernate `ddl-auto=update` auto-migrates schema on startup
- `DataSeeder` (CommandLineRunner) seeds admin user, 30 employees, departments, positions, attendance, leaves, payroll, and reviews on first run
- SQL seed scripts in `database/` directory

---

## Architecture

### API Base URL

All REST endpoints are under `/api/v1`. See `API_ENDPOINTS.md` for the full endpoint catalog.

### Security

- JWT stateless auth (HS256). Token stored in `localStorage`, attached via Axios interceptor.
- Roles: `ROLE_HR_ADMIN`, `ROLE_EMPLOYEE`
- Method-level security via `@PreAuthorize` on controllers
- BCrypt password encoding
- JWT claims: `{ sub, roles, exp }`, 24-hour expiration
- Default admin login: check `DataSeeder.java` for seeded credentials

### Layered Architecture (Backend)

1. **Controller** — 10 REST controllers under `com/hrms/controller/`:
   - Admin: `AdminUserController`, `AdminAttendanceController`, `AdminLeaveController`, `AdminPayrollController`, `AdminPerformanceController`, `AdminDashboardController`, `AdminDepartmentController`, `AdminPositionController`
   - Employee: `EmployeeAttendanceController`, `EmployeeLeaveController`, `EmployeeDashboardController`
   - Auth: `AuthController`

2. **Service** — 4 services under `com/hrms/service/`: `AuthService`, `AttendanceService`, `LeaveService`, `PayrollService`

3. **Repository** — 8 Spring Data JPA repositories under `com/hrms/repository/`

4. **Entity** — 8 JPA entities under `com/hrms/entity/`:
   - `User`, `Role` (ManyToMany), `Attendance`, `LeaveRequest`, `Payroll`, `PaySlip`, `PerformanceReview`, `Department`, `Position`

### Frontend Architecture

- **Auth gate**: `App.js` checks JWT in `localStorage` → validates via `/auth/me` → routes to `AdminDashboard` or `EmployeeDashboard`
- **Role-based routing**: `ProtectedRoute.jsx` guards admin/employee areas
- **Services**: `frontend/src/services/` — `authService`, `adminService`, `employeeService`, `attendanceService` (shared Axios instance with JWT interceptor)
- **UI components**: Custom shadcn-ui style library in `frontend/src/components/ui/`
- **Tailwind**: Custom design tokens via CSS variables in Tailwind config

### Key Domain Workflows

1. **Attendance**: Clock-in/out via `POST /employee/attendance/{clock-in|clock-out}`. Auto-late detection (after 9:15 AM). Admin can view/filter all records.
2. **Leave**: Employee submits request → balance validated → admin approves/rejects. Deducts from leave entitlements on approval.
3. **Payroll**: Async calculation engine: `baseSalary + overtimePay(1.5x) + extraSalary + ilPayout - lateDeduction(tiered $5/$15/50%) - tax(15%) - insurance(4%) - otherDeductions`. Status flow: `DRAFT → PROCESSED → PAID`.
4. **Performance**: 5-axis scoring (quality, productivity, communication, teamwork, punctuality). Overall = average of all axes.
5. **Departments & Positions**: Department has a head (User), contains Positions. Positions have salary ranges.

---

## Important Notes

- No `@PreAuthorize` annotations on admin/employee controllers — the frontend `ProtectedRoute` provides role-based access control, and the backend relies on JWT filter for authentication. Be cautious when adding new admin endpoints.
- `application.yml` has `show-sql: true` and `logging.level.org.springframework.security: DEBUG` — useful for debugging.
- `AdminUserController` uses inline DTO classes (defined as inner classes) rather than separate files in `dto/`.
- The payroll calculation uses `CompletableFuture` for async processing.
- Frontend seed data in `frontend/src/services/` uses `localStorage` — check `loadingFromLocalStorage` flags when debugging data issues.
- Tailwind config uses CSS variables for theming (`hsl(var(--primary))` pattern).
- The project does NOT use Docker or have CI/CD pipelines configured.
- No linter (Checkstyle, SpotBugs, ESLint) is configured beyond defaults.
