/*
 * ================================================================
 * HRMS — Clear All Data, Keep Only Admin User
 *
 * This script deletes all non-admin data while preserving:
 *   - The ROLE_HR_ADMIN and ROLE_EMPLOYEE roles
 *   - The admin user (admin@hrms.local)
 *   - The admin's user_roles mapping
 *
 * All other users and their related data (attendance, leave requests,
 * payroll, performance reviews) are deleted.
 *
 * Usage:
 *   psql -U postgres -d hr_system -f clear_data_keep_admin.sql
 * ================================================================
 */

BEGIN;

-- 1. Delete attendance records for non-admin users
DELETE FROM attendance WHERE user_id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (
        SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
    )
);

-- 2. Delete leave requests for non-admin users
DELETE FROM leave_requests WHERE user_id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (
        SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
    )
);

-- 3. Delete payroll records for non-admin users
DELETE FROM payroll WHERE user_id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (
        SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
    )
);

-- 4. Delete performance reviews for non-admin employees
DELETE FROM performance_reviews WHERE employee_id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (
        SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
    )
);

-- 5. Delete user_roles mappings for non-admin users
DELETE FROM user_roles WHERE role_id != (
    SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
);

-- 6. Delete all users except the admin
DELETE FROM users WHERE id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (
        SELECT id FROM roles WHERE name = 'ROLE_HR_ADMIN'
    )
);

COMMIT;
