# HRMS — REST API Endpoints

Base URL: `/api/v1`

All authenticated endpoints require: `Authorization: Bearer <JWT>`

---

## 1 — Authentication (Public)
| Method | Endpoint                 | Body / Params                          |
|--------|--------------------------|----------------------------------------|
| POST   | `/auth/login`            | `{ email, password }` → `{ token, user, roles }` |
| POST   | `/auth/register`          | `{ email, password, firstName, lastName }` |
| POST   | `/auth/refresh`          | `{ refreshToken }` → `{ token }`               |

---

## 2 — HR ADMIN Endpoints *(ROLE_HR_ADMIN required)*

### User Management
| Method | Endpoint                     | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/admin/users`              | Paginated list + search/filter by name/dept  |
| GET    | `/admin/users/{id}`         | Get single employee profile                  |
| POST   | `/admin/users`              | Create employee (+set role, salary, dept)    |
| PUT    | `/admin/users/{id}`         | Update employee profile                      |
| DELETE | `/admin/users/{id}`         | Deactivate employee                          |
| PUT    | `/admin/users/{id}/role`    | Change employee role                         |

### Attendance & Leave
| Method | Endpoint                          | Description                                   |
|--------|-----------------------------------|-----------------------------------------------|
| GET    | `/admin/attendance`              | Filter by date range, employee, status        |
| GET    | `/admin/attendance/{id}`         | Single attendance detail                      |
| GET    | `/admin/leaves`                  | All leave requests (paginated, filter status) |
| GET    | `/admin/leaves/pending`          | Only pending leave requests                   |
| PUT    | `/admin/leaves/{id}/approve`     | Approve a leave request                       |
| PUT    | `/admin/leaves/{id}/reject`      | Reject + `{ rejectionReason }`                |

### Payroll
| Method | Endpoint                           | Description                                   |
|--------|------------------------------------|-----------------------------------------------|
| POST   | `/admin/payroll/calculate`        | Run engine: base + OT*rate + extra - deductions |
| GET    | `/admin/payroll`                  | List payrolls, filter by period / user         |
| GET    | `/admin/payroll/{id}`             | Single payroll detail                         |
| POST   | `/admin/payroll`                  | Create payroll record                         |
| PUT    | `/admin/payroll/{id}/process`     | Mark as PROCESSED                             |
| PUT    | `/admin/payroll/{id}/pay`         | Mark as PAID, trigger payslip generation       |
| GET    | `/admin/payslips/{id}/download`   | Download payslip PDF                           |

### Performance Reviews
| Method | Endpoint                         | Description                        |
|--------|----------------------------------|------------------------------------|
| GET    | `/admin/performance`             | List all reviews (filter/employee) |
| POST   | `/admin/performance`             | Submit new review                  |
| PUT    | `/admin/performance/{id}`        | Update review                      |
| DELETE | `/admin/performance/{id}`        | Delete review                      |

### Dashboard
| Method | Endpoint                     | Description                                    |
|--------|------------------------------|------------------------------------------------|
| GET    | `/admin/dashboard/stats`     | Summary: headcount, attendance %, pending leaves |

---

## 3 — EMPLOYEE Endpoints *(ROLE_EMPLOYEE required)*

### Attendance Scanner
| Method | Endpoint                    | Body / Params                                              |
|---------|-----------------------------|------------------------------------------------------------|
| POST    | `/employee/attendance/clock-in`  | `{ latitude?, longitude?, note? }` → record with timestamp |
| POST    | `/employee/attendance/clock-out` | `{ note? }` → update existing today's clock-out             |
| GET     | `/employee/attendance`      | My attendance history (date range filter)                   |
| GET     | `/employee/attendance/today`| Today's clock status                                        |

### Leave Requests
| Method | Endpoint                    | Description                                  |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/employee/leaves`          | My leave requests                            |
| POST   | `/employee/leaves`          | `{ leaveType, startDate, endDate, reason }`  |
| DELETE | `/employee/leaves/{id}`     | Cancel (only if PENDING)                     |

### Reports / Self-Service
| Method | Endpoint                        | Description                              |
|---------|---------------------------------|------------------------------------------|
| GET     | `/employee/dashboard/summary`   | Attendance %, OT hours, pending leaves   |
| GET     | `/employee/payslips`            | My payslips                              |
| GET     | `/employee/payslips/{id}/download` | Download my payslip                  |
| GET     | `/employee/performance`         | My reviews                               |
| GET     | `/employee/profile`             | My profile                               |
| PUT     | `/employee/profile`             | Update phone, etc.                       |

---

## 4 — Java REST Controllers (Outline)

```java
// AuthController.java
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    @PostMapping("/login")    public LoginResponse login(@RequestBody LoginRequest req)
    @PostMapping("/register") public User register(@RequestBody RegisterRequest req)
    @PostMapping("/refresh")  public TokenRefreshResponse refresh(@RequestBody TokenRefreshRequest req)
}

// AdminUserController.java
@RestController @RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminUserController {
    @GetMapping   Page<UserResponse> getUsers(@RequestParam(required=false) String search, Pageable page)
    @GetMapping("/{id}")       UserResponse getUser(@PathVariable Long id)
    @PostMapping  UserResponse createUser(@Valid @RequestBody CreateUserRequest req)
    @PutMapping("/{id}")       UserResponse updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req)
    @DeleteMapping("/{id}")    void deactivateUser(@PathVariable Long id)
    @PutMapping("/{id}/role")  UserResponse updateRole(@PathVariable Long id, @RequestBody RoleRequest req)
}

// AdminAttendanceController.java
@RestController @RequestMapping("/api/v1/admin/attendance")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminAttendanceController {
    @GetMapping Page<AttendanceResponse> getAttendance(@RequestParam LocalDate from, LocalDate to, Long userId)
    @GetMapping("/{id}") AttendanceResponse getAttendanceById(@PathVariable Long id)
}

// AdminLeaveController.java
@RestController @RequestMapping("/api/v1/admin/leaves")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminLeaveController {
    @GetMapping       Page<LeaveResponse> getLeaves(@RequestParam LeaveStatus status, Pageable page)
    @PutMapping("/{id}/approve") LeaveResponse approve(@PathVariable Long id)
    @PutMapping("/{id}/reject")  LeaveResponse reject(@PathVariable Long id, @RequestBody RejectRequest req)
}

// AdminPayrollController.java
@RestController @RequestMapping("/api/v1/admin/payroll")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminPayrollController {
    @PostMapping("/calculate") PayrollResponse calculate(@RequestBody PayrollCalcRequest req)
    @GetMapping  Page<PayrollResponse> getPayrolls(Pageable page)
    @PostMapping PayrollResponse create(@RequestBody PayrollRequest req)
    @PutMapping("/{id}/process") PayrollResponse process(@PathVariable Long id)
    @PutMapping("/{id}/pay")     PayrollResponse markPaid(@PathVariable Long id)
}

// AdminPaySlipController.java
@RestController @RequestMapping("/api/v1/admin/payslips")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminPaySlipController {
    @GetMapping("/{id}/download") ResponseEntity<byte[]> download(@PathVariable Long id)
}

// AdminPerformanceController.java
@RestController @RequestMapping("/api/v1/admin/performance")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminPerformanceController {
    @GetMapping   Page<PerformanceResponse> getReviews(Pageable page)
    @PostMapping  PerformanceResponse createReview(@Valid @RequestBody PerformanceReviewRequest req)
    @PutMapping("/{id}") PerformanceResponse updateReview(@PathVariable Long id, @RequestBody PerformanceReviewRequest req)
    @DeleteMapping("/{id}") void deleteReview(@PathVariable Long id)
}

// AdminDashboardController.java
@RestController @RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasRole('HR_ADMIN')")
public class AdminDashboardController {
    @GetMapping("/stats") DashboardStatsResponse getStats()
}

// EmployeeAttendanceController.java
@RestController @RequestMapping("/api/v1/employee/attendance")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeAttendanceController {
    @PostMapping("/clock-in")  AttendanceResponse clockIn(@Valid @RequestBody ClockRequest req)
    @PostMapping("/clock-out") AttendanceResponse clockOut(@RequestBody ClockRequest req)
    @GetMapping  List<AttendanceResponse> getMyAttendance(@RequestParam LocalDate from, LocalDate to)
    @GetMapping("/today") AttendanceResponse getToday()
}

// EmployeeLeaveController.java
@RestController @RequestMapping("/api/v1/employee/leaves")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeLeaveController {
    @GetMapping  List<LeaveResponse> getMyLeaves()
    @PostMapping LeaveResponse requestLeave(@Valid @RequestBody LeaveRequestDto req)
    @DeleteMapping("/{id}") void cancelLeave(@PathVariable Long id)
}

// EmployeeDashboardController.java
@RestController @RequestMapping("/api/v1/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeDashboardController {
    @GetMapping("/dashboard/summary") EmployeeSummaryResponse getSummary()
    @GetMapping("/payslips")          List<PaySlipResponse> getPaySlips()
    @GetMapping("/payslips/{id}/download") ResponseEntity<byte[]> downloadPaySlip(@PathVariable Long id)
    @GetMapping("/performance")       List<PerformanceResponse> getMyPerformance()
    @GetMapping("/profile")           UserResponse getProfile()
    @PutMapping("/profile")           UserResponse updateProfile(@RequestBody UpdateProfileRequest req)
}
```

---

## JWT Security Flow

```
Client                         Server
  |---- POST /auth/login ------>|
  |<--- { token: JWT } --------|
  |
  |---- GET /admin/users ----->|
  |    Authorization: Bearer JWT
  |<--- [users data] ----------|

JWT Claims: { sub: userId, roles: ["ROLE_HR_ADMIN"], exp: 3600 }
Refresh token (httpOnly cookie): expires 7 days
```

Spring Security config: `JwtRequestFilter` → validates Bearer token, sets `SecurityContext`.
Password encoding: BCryptPasswordEncoder.
