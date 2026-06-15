# HRMS Project Instructions

This document provides foundational mandates and workflows for the HRMS project. Adhere to these instructions to maintain consistency and quality across the codebase.

## Project Overview
HRMS (Human Resources Management System) is a full-stack application for managing employees, attendance, leave, payroll, and performance reviews.

- **Backend:** Java 17, Spring Boot 3.3.4, PostgreSQL.
- **Frontend:** React 18, Tailwind CSS, Vanilla CSS.

## Foundational Mandates
- **Empirical Validation:** Always reproduce reported bugs with a test case before fixing.
- **Documentation:** Maintain `API_ENDPOINTS.md` when adding or modifying REST endpoints.
- **Security:** Rigorously protect JWT implementation. Never log sensitive user data.
- **Modernization:** Prioritize modern Java features (Java 17+) and functional React patterns.

## Subdirectory Instructions
- [Backend Instructions](./backend/GEMINI.md)
- [Frontend Instructions](./frontend/GEMINI.md)

## Development Workflows
### Backend
- Use `mvn spring-boot:run` to start the server on port 8081.
- Run tests using `mvn test`.
- Adhere to the Controller -> Service -> Repository -> Entity architecture.

### Frontend
- Use `npm start` in the `frontend` directory to start the dev server on port 3000.
- All components should be responsive (mobile-first for employees, desktop-first for admins).
- Use Tailwind CSS for utility-based styling and CSS variables for theming.

## Coding Standards
- **Naming:** CamelCase for Java classes and JavaScript variables/functions. PascalCase for React components.
- **Linting:** Follow standard Java and JavaScript formatting (e.g., Google Java Style, Prettier).
- **Types:** Use TypeScript-like precision in JavaScript (e.g., JSDoc) where possible, even though the project is currently JS.
