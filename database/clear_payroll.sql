-- Clear all payroll records so you can recalculate
-- Run this against your hr_system database

DELETE FROM payslips WHERE payroll_id IN (SELECT id FROM payroll);
DELETE FROM payroll;

-- Or to delete only DRAFT records:
-- DELETE FROM payroll WHERE status = 'DRAFT';
