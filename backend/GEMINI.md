# Backend Instructions (Java/Spring Boot)

Specific guidelines for the HRMS backend.

## Tech Stack
- **Runtime:** Java 17
- **Framework:** Spring Boot 3.3.4
- **Security:** Spring Security + JWT (jjwt 0.12.6)
- **Data:** Spring Data JPA + Hibernate + PostgreSQL
- **Utilities:** Lombok, Jackson (with Hibernate6 and JSR310 support)

## Architecture & Design
- **Layered Architecture:** 
  - `controller`: REST endpoints. Note: `AdminUserController` uses inline DTOs.
  - `service`: Business logic. Use async patterns for heavy tasks like Payroll.
  - `repository`: Data access interfaces.
  - `entity`: JPA entities. All entities must use `createdAt`/`updatedAt` callbacks.
  - `dto`: Request/Response objects. Use separate DTO files for most controllers.
- **Security:** Use `@PreAuthorize` on controllers for role-based access. Roles: `ROLE_HR_ADMIN`, `ROLE_EMPLOYEE`.

## Development Commands
- **Compile:** `mvn compile`
- **Run:** `mvn spring-boot:run`
- **Test:** `mvn test`
- **Package:** `mvn package`

## Conventions
- **Error Handling:** Use `GlobalExceptionHandler.java` for centralized error responses.
- **Validation:** Use `spring-boot-starter-validation` annotations (e.g., `@NotBlank`, `@Email`) in DTOs.
- **Database:** Hibernate `ddl-auto=update` is used for development. Seed scripts are in `database/`.
