# HRMS — Human Resources Management System

## Technology Stack
- **Frontend:** React (JavaScript) + vanilla CSS design system
- **Backend:** Java / Spring Boot + Spring Security + JWT + JPA/Hibernate
- **Database:** Any SQL (MySQL / PostgreSQL) — entities ready for schema generation

---

## Project Structure

```
HR System/
│
├── README.md                     ← This file
├── API_ENDPOINTS.md              ← Full REST API route documentation
│
├── backend/
│   └── src/main/java/com/hrms/
│       ├── entity/               ← 6 JPA Entity classes
│       │   ├── User.java         ← Employee/Admin user with roles & salary
│       │   ├── Role.java         ← ROLE_HR_ADMIN, ROLE_EMPLOYEE
│       │   ├── Attendance.java   ← Clock in/out records with geo + status
│       │   ├── LeaveRequest.java ← Leave workflow (Pending→Approved/Rejected)
│       │   ├── Payroll.java      ← Calculation engine (gross/net/deductions)
│       │   ├── PerformanceReview.java ← 5-axis scoring + feedback
│       │   └── PaySlip.java      ← Generated payslip per payroll
│       ├── controller/           ← REST Controllers (see API_ENDPOINTS.md)
│       ├── service/              ← Business logic layer
│       ├── repository/           ← Spring Data JPA repositories
│       ├── dto/                  ← Request/Response DTOs
│       ├── security/             ← JWT filter, config, UserDetails
│       └── config/              ← CORS, Security, Bean configs
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── index.js             ← React app entry
│   │   ├── App.js               ← Auth gate + role-based routing
│   │   ├── styles/
│   │   │   └── global.css        ← Full design system (responsive)
│   │   ├── services/
│   │   │   ├── api.js            ← Axios interceptor (JWT Bearer)
│   │   │   ├── authService.js    ← Login, register, current user
│   │   │   ├── employeeService.js ← Employee API calls
│   │   │   └── adminService.js   ← Admin API calls
│   │   ├── hooks/
│   │   │   └── useToast.js       ← Global toast notification hook
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ToastContainer.js
│   │   │   │   └── LoadingSpinner.js
│   │   │   ├── admin/           ← (reuse AdminDashboard pages)
│   │   │   └── employee/        ← (reuse EmployeeDashboard pages)
│   │   └── pages/
│   │       ├── LoginPage.js     ← Auth form with JWT storage
│   │       ├── AdminDashboard.js← Desktop-optimized sidebar layout
│   │       └── EmployeeDashboard.js ← Mobile-first bottom nav layout
│
```

---

## Key Design Decisions

### Database
- `User` ↔ `Role` — ManyToMany (a user can have multiple roles if needed)
- `Attendance` indexed on `(user_id, date)` for fast daily lookups
- `Payroll.pay_period_start + pay_period_end` unique constraint prevents duplicates
- `Payroll.calculateNet(a,b,c,d,e,f)` — `@Transient` static formula for the calculation engine
- `PerformanceReview` — 5-axis scoring (quality, productivity, communication, teamwork, punctuality)
- All entities use `createdAt`/`updatedAt` auto-timestamped via JPA callbacks

### Security
- JWT stateless authentication with Bearer <REDACTED>
- `@PreAuthorize("hasRole('HR_ADMIN')")` on admin endpoints
- `@PreAuthorize("hasRole('EMPLOYEE')")` on employee endpoints
- Axios interceptor auto-attaches token; 401 → redirect to login

### UI/UX
- **Desktop-first Admin**: Fixed sidebar + topbar, data tables with search/filter/pagination, form modals
- **Mobile-first Employee**: Bottom tab nav, big clock-in button, card-based layout for payslips/responsive leave tracker
- **Design system**: Teal primary (#4ECDC4), green/yellow/red semantic badges, system font stack, full responsive breakpoints at 768px
- **Feedback**: Toast notifications on all CRUD, loading spinners on data fetch

---

## Backend Setup (Quick Start)

```bash
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hrms
spring.datasource.username=root
spring.datasource.password=<REDACTED>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=your-256-bit-secret
app.jwt.expiration=3600000
```

## Frontend Setup

```bash
cd "C:\Users\SOK THAVIREAK\Desktop\HR System\frontend"
npm install
npm start     # Runs on http://localhost:3000
```

---
