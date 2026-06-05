/**
 * Seed data for localStorage initialization.
 * Used when the backend is not available or returns empty data.
 * Each page checks if localStorage is empty and seeds on first load.
 */

export const SEED_DEPARTMENTS = [
  { id: 1, name: 'Engineering', description: 'Software development, DevOps, and QA', headUserId: null },
  { id: 2, name: 'Marketing', description: 'Brand, content, SEO, and social media', headUserId: null },
  { id: 3, name: 'Finance', description: 'Accounting, payroll, and financial planning', headUserId: null },
  { id: 4, name: 'Human Resources', description: 'Recruitment, employee relations, and HR ops', headUserId: null },
  { id: 5, name: 'Sales', description: 'Revenue generation and client relations', headUserId: null },
  { id: 6, name: 'Operations', description: 'Logistics, supply chain, and facilities', headUserId: null },
  { id: 7, name: 'Design', description: 'UX/UI, graphic design, and brand identity', headUserId: null },
  { id: 8, name: 'Legal', description: 'Compliance, contracts, and legal counsel', headUserId: null },
  { id: 9, name: 'Customer Support', description: 'Customer success and technical support', headUserId: null },
];

export const SEED_POSITIONS = [
  // Engineering
  { id: 1, title: 'Senior Software Engineer', description: 'Lead developer for core platform', departmentId: 1, department: 'Engineering' },
  { id: 2, title: 'Software Engineer', description: 'Full-stack development', departmentId: 1, department: 'Engineering' },
  { id: 3, title: 'DevOps Engineer', description: 'CI/CD and infrastructure', departmentId: 1, department: 'Engineering' },
  { id: 4, title: 'Frontend Developer', description: 'React/UI development', departmentId: 1, department: 'Engineering' },
  { id: 5, title: 'Backend Developer', description: 'API and service development', departmentId: 1, department: 'Engineering' },
  { id: 6, title: 'QA Lead', description: 'Quality assurance and test automation', departmentId: 1, department: 'Engineering' },
  // Marketing
  { id: 7, title: 'Marketing Manager', description: 'Marketing strategy and campaigns', departmentId: 2, department: 'Marketing' },
  { id: 8, title: 'Content Strategist', description: 'Content planning and creation', departmentId: 2, department: 'Marketing' },
  { id: 9, title: 'SEO Specialist', description: 'Search engine optimization', departmentId: 2, department: 'Marketing' },
  { id: 10, title: 'Social Media Manager', description: 'Social media presence and engagement', departmentId: 2, department: 'Marketing' },
  // Finance
  { id: 11, title: 'Finance Manager', description: 'Financial planning and oversight', departmentId: 3, department: 'Finance' },
  { id: 12, title: 'Senior Accountant', description: 'General ledger and reporting', departmentId: 3, department: 'Finance' },
  { id: 13, title: 'Financial Analyst', description: 'Budget analysis and forecasting', departmentId: 3, department: 'Finance' },
  // HR
  { id: 14, title: 'HR Manager', description: 'HR strategy and people operations', departmentId: 4, department: 'Human Resources' },
  { id: 15, title: 'Recruiter', description: 'Talent acquisition and hiring', departmentId: 4, department: 'Human Resources' },
  { id: 16, title: 'HR Coordinator', description: 'Onboarding and HR administration', departmentId: 4, department: 'Human Resources' },
  // Sales
  { id: 17, title: 'Sales Director', description: 'Sales strategy and team leadership', departmentId: 5, department: 'Sales' },
  { id: 18, title: 'Account Executive', description: 'Key account management', departmentId: 5, department: 'Sales' },
  { id: 19, title: 'Sales Representative', description: 'New business development', departmentId: 5, department: 'Sales' },
  { id: 20, title: 'Business Development Rep', description: 'Lead generation and prospecting', departmentId: 5, department: 'Sales' },
  // Operations
  { id: 21, title: 'Operations Manager', description: 'Operations oversight and optimization', departmentId: 6, department: 'Operations' },
  { id: 22, title: 'Logistics Coordinator', description: 'Supply chain and logistics', departmentId: 6, department: 'Operations' },
  { id: 23, title: 'Supply Chain Analyst', description: 'Inventory and supply optimization', departmentId: 6, department: 'Operations' },
  // Design
  { id: 24, title: 'Lead UX Designer', description: 'User experience and design systems', departmentId: 7, department: 'Design' },
  { id: 25, title: 'UI Designer', description: 'Interface design and prototyping', departmentId: 7, department: 'Design' },
  { id: 26, title: 'Graphic Designer', description: 'Visual design and brand assets', departmentId: 7, department: 'Design' },
  // Legal
  { id: 27, title: 'General Counsel', description: 'Legal strategy and compliance', departmentId: 8, department: 'Legal' },
  { id: 28, title: 'Legal Analyst', description: 'Contract review and legal research', departmentId: 8, department: 'Legal' },
  // Customer Support
  { id: 29, title: 'Support Manager', description: 'Support team leadership', departmentId: 9, department: 'Customer Support' },
  { id: 30, title: 'Support Specialist', description: 'Customer issue resolution', departmentId: 9, department: 'Customer Support' },
];

const firstNames = ['Sophia', 'Marcus', 'Priya', 'David', 'Aisha', 'Carlos', 'Emily', 'James', 'Olga', 'Raj', 'Lisa', 'Mohammed', 'Fatima', 'Anna', 'Kevin', 'Nguyen', 'Robert', 'Sara', 'Daniel', 'Mei', 'Peter', 'Linda', 'Omar', 'Isabella', 'Tom', 'Nadia', 'William', 'Claire', 'Alex', 'Jenny'];
const lastNames = ['Chen', 'Johnson', 'Patel', 'Kim', 'Ahmed', 'Reyes', 'Wang', 'Martin', 'Smirnova', 'Gupta', 'Thompson', 'Ali', 'Hassan', 'Mueller', 'Brown', 'Tran', 'Wilson', 'Dupont', 'Lee', 'Lin', 'Jones', 'Zhang', 'Farouk', 'Rossi', 'Harris', 'Petrova', 'Scott', 'Dubois', 'Morgan', 'Adams'];
const departments = ['Engineering', 'Engineering', 'Engineering', 'Engineering', 'Engineering', 'Engineering', 'Marketing', 'Marketing', 'Marketing', 'Marketing', 'Finance', 'Finance', 'Finance', 'Human Resources', 'Human Resources', 'Human Resources', 'Sales', 'Sales', 'Sales', 'Sales', 'Operations', 'Operations', 'Operations', 'Design', 'Design', 'Design', 'Legal', 'Legal', 'Customer Support', 'Customer Support'];
const positions = ['Senior Software Engineer', 'Software Engineer', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'QA Lead', 'Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Social Media Manager', 'Finance Manager', 'Senior Accountant', 'Financial Analyst', 'HR Manager', 'Recruiter', 'HR Coordinator', 'Sales Director', 'Account Executive', 'Sales Representative', 'Business Development Rep', 'Operations Manager', 'Logistics Coordinator', 'Supply Chain Analyst', 'Lead UX Designer', 'UI Designer', 'Graphic Designer', 'General Counsel', 'Legal Analyst', 'Support Manager', 'Support Specialist'];
const salaries = [95000, 75000, 82000, 70000, 73000, 78000, 80000, 60000, 55000, 58000, 88000, 68000, 62000, 78000, 55000, 50000, 92000, 65000, 52000, 56000, 85000, 58000, 61000, 82000, 67000, 54000, 105000, 65000, 72000, 48000];

export const SEED_USERS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 2,
  email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@hrms.local`,
  firstName: firstNames[i],
  lastName: lastNames[i],
  phone: `+1-555-${String(201 + i).padStart(4, '0')}`,
  department: departments[i],
  position: positions[i],
  baseSalary: salaries[i],
  hireDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  active: true,
  roles: [{ name: 'ROLE_EMPLOYEE' }],
}));

// Generate attendance for June 2025 (21 work days)
const workDays = [
  '2025-06-02','2025-06-03','2025-06-04','2025-06-05','2025-06-06',
  '2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13',
  '2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20',
  '2025-06-23','2025-06-24','2025-06-25','2025-06-26','2025-06-27',
  '2025-06-30'
];

export const SEED_ATTENDANCE = [];
for (let uid = 2; uid <= 31; uid++) {
  workDays.forEach((date, idx) => {
    let status = 'PRESENT';
    let hours = 8.0;
    let lateMinutes = 0;
    let clockIn = `${date}T08:5${idx % 10}:00`;
    let clockOut = `${date}T17:1${idx % 5}:00`;

    if (uid % 7 === 0 && idx % 5 === 0) {
      status = 'LATE';
      lateMinutes = 15 + (idx % 3) * 10;
      clockIn = `${date}T09:${15 + lateMinutes}:00`;
      clockOut = `${date}T17:${15 + lateMinutes}:00`;
    } else if (uid % 11 === 0 && idx % 8 === 0) {
      status = 'ABSENT';
      hours = 0;
      lateMinutes = 0;
      clockIn = null;
      clockOut = null;
    } else if (uid % 5 === 0 && idx % 10 === 0) {
      status = 'HALF_DAY';
      hours = 4.0;
      clockIn = `${date}T09:00:00`;
      clockOut = `${date}T13:00:00`;
    }

    SEED_ATTENDANCE.push({
      id: SEED_ATTENDANCE.length + 1,
      user: { id: uid, firstName: firstNames[uid - 2] || 'User', lastName: lastNames[uid - 2] || 'Test', department: departments[uid - 2] || 'Engineering' },
      date,
      clockInTime: clockIn,
      clockOutTime: clockOut,
      hoursWorked: hours,
      status,
      lateMinutes,
      overtimeHours: hours > 8 ? hours - 8 : 0,
    });
  });
}

export const SEED_LEAVES = [
  { id: 1, user: { firstName: 'Sophia', lastName: 'Chen' }, leaveType: 'ANNUAL', startDate: '2025-06-09', endDate: '2025-06-13', totalDays: 5, reason: 'Family vacation to Hawaii', status: 'APPROVED' },
  { id: 2, user: { firstName: 'Carlos', lastName: 'Reyes' }, leaveType: 'SICK', startDate: '2025-06-16', endDate: '2025-06-17', totalDays: 2, reason: 'Medical appointment and recovery', status: 'APPROVED' },
  { id: 3, user: { firstName: 'Raj', lastName: 'Gupta' }, leaveType: 'ANNUAL', startDate: '2025-06-23', endDate: '2025-06-27', totalDays: 5, reason: 'Summer break with family', status: 'APPROVED' },
  { id: 4, user: { firstName: 'Nguyen', lastName: 'Tran' }, leaveType: 'EMERGENCY', startDate: '2025-06-04', endDate: '2025-06-04', totalDays: 1, reason: 'Family emergency — parent hospitalized', status: 'APPROVED' },
  { id: 5, user: { firstName: 'Nadia', lastName: 'Petrova' }, leaveType: 'ANNUAL', startDate: '2025-06-16', endDate: '2025-06-20', totalDays: 5, reason: 'Trip to Japan', status: 'APPROVED' },
  { id: 6, user: { firstName: 'Alex', lastName: 'Morgan' }, leaveType: 'SICK', startDate: '2025-06-25', endDate: '2025-06-26', totalDays: 2, reason: 'Dental surgery recovery', status: 'APPROVED' },
  { id: 7, user: { firstName: 'Marcus', lastName: 'Johnson' }, leaveType: 'ANNUAL', startDate: '2025-07-07', endDate: '2025-07-11', totalDays: 5, reason: 'Visiting relatives overseas', status: 'PENDING' },
  { id: 8, user: { firstName: 'Lisa', lastName: 'Thompson' }, leaveType: 'SICK', startDate: '2025-07-01', endDate: '2025-07-02', totalDays: 2, reason: 'Scheduled surgery', status: 'PENDING' },
  { id: 9, user: { firstName: 'Sara', lastName: 'Dupont' }, leaveType: 'MATERNITY', startDate: '2025-07-14', endDate: '2025-08-14', totalDays: 30, reason: 'Maternity leave', status: 'PENDING' },
  { id: 10, user: { firstName: 'Peter', lastName: 'Jones' }, leaveType: 'ANNUAL', startDate: '2025-07-21', endDate: '2025-07-25', totalDays: 5, reason: 'Wedding anniversary trip', status: 'PENDING' },
  { id: 11, user: { firstName: 'William', lastName: 'Scott' }, leaveType: 'EMERGENCY', startDate: '2025-07-03', endDate: '2025-07-03', totalDays: 1, reason: 'Home repair emergency', status: 'PENDING' },
  { id: 12, user: { firstName: 'Emily', lastName: 'Wang' }, leaveType: 'ANNUAL', startDate: '2025-06-09', endDate: '2025-06-13', totalDays: 5, reason: 'Personal travel', status: 'REJECTED' },
  { id: 13, user: { firstName: 'Anna', lastName: 'Mueller' }, leaveType: 'UNPAID', startDate: '2025-06-23', endDate: '2025-07-04', totalDays: 10, reason: 'Extended personal project', status: 'REJECTED' },
  { id: 14, user: { firstName: 'Isabella', lastName: 'Rossi' }, leaveType: 'ANNUAL', startDate: '2025-06-16', endDate: '2025-06-27', totalDays: 10, reason: 'Too many team members already on leave', status: 'REJECTED' },
];

export const SEED_PAYROLLS = SEED_USERS.map((u, i) => {
  const base = Math.round(u.baseSalary / 12 * 100) / 100;
  const extra = [500, 300, 400, 200, 250, 350, 400, 150, 100, 200, 500, 300, 200, 350, 150, 100, 1000, 500, 200, 300, 400, 200, 250, 400, 250, 150, 600, 300, 350, 150][i];
  const otHours = [10, 5, 8, 3, 4, 6, 5, 2, 0, 3, 4, 3, 2, 3, 1, 0, 5, 3, 2, 4, 4, 2, 3, 5, 2, 1, 2, 1, 4, 1][i];
  const otPay = otHours * Math.round(base / 160 * 1.5);
  const gross = base + extra + otPay;
  const tax = Math.round(gross * 0.15);
  const insurance = Math.round(gross * 0.04);
  const other = [100, 50, 75, 25, 30, 60, 50, 20, 15, 25, 80, 40, 30, 50, 20, 15, 100, 40, 20, 30, 60, 25, 30, 55, 30, 20, 100, 35, 40, 15][i];
  const totalDed = tax + insurance + other;
  const net = Math.round((gross - totalDed) * 100) / 100;
  const statuses = ['PAID', 'PAID', 'PAID', 'PROCESSED', 'PROCESSED', 'DRAFT', 'PAID', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PROCESSED', 'DRAFT', 'PAID', 'PROCESSED', 'PAID', 'DRAFT'];

  return {
    id: i + 1,
    user: { id: u.id, firstName: u.firstName, lastName: u.lastName },
    payPeriodStart: '2025-06-01',
    payPeriodEnd: '2025-06-30',
    baseSalary: base,
    fullTimeWorkHours: 160,
    actualWorkHours: 160 + otHours - (i % 3 === 0 ? 2 : 0),
    overtimeHours: otHours,
    overtimePay: otPay,
    extraSalary: extra,
    lateDeduction: i % 4 === 0 ? 25 : 0,
    lateMinutes: i % 4 === 0 ? 15 : 0,
    taxDeduction: tax,
    insuranceDeduction: insurance,
    otherDeductions: other,
    grossSalary: Math.round(gross * 100) / 100,
    totalDeductions: totalDed,
    netSalary: net,
    status: statuses[i],
    paymentDate: statuses[i] === 'PAID' ? '2025-07-05' : null,
  };
});

export const SEED_REVIEWS = SEED_USERS.map((u, i) => ({
  id: i + 1,
  employee: { id: u.id, firstName: u.firstName, lastName: u.lastName },
  reviewer: { id: 1, firstName: 'Admin', lastName: 'User' },
  reviewPeriodStart: '2025-01-01',
  reviewPeriodEnd: '2025-06-30',
  qualityScore: 4 + (i % 3 === 0 ? 1 : 0),
  productivityScore: 4 + (i % 4 === 0 ? 1 : 0),
  communicationScore: 3 + (i % 3 === 0 ? 2 : 1),
  teamworkScore: 4 + (i % 5 === 0 ? 1 : 0),
  punctualityScore: 4 + (i % 7 === 0 ? 1 : 0),
  overallScore: [4.8, 4.2, 4.2, 4.2, 4.0, 4.2, 4.8, 4.4, 4.2, 4.2, 4.6, 4.2, 4.0, 4.6, 4.4, 4.4, 4.6, 4.4, 4.0, 4.2, 4.6, 4.4, 4.2, 4.6, 4.2, 4.2, 4.8, 4.2, 4.6, 4.6][i],
  feedback: [
    'Exceptional technical leadership. Drove the microservices migration ahead of schedule.',
    'Solid contributor. Delivered all sprint commitments on time. Great team player.',
    'Outstanding DevOps work. Reduced deployment time by 60%.',
    'Creative frontend developer with excellent UI sensibility.',
    'Reliable backend developer. API response times improved 30%.',
    'Excellent QA lead. Bug escape rate dropped 40%.',
    'Outstanding marketing leadership. Q2 campaign exceeded targets by 35%.',
    'Creative content strategist. Blog traffic increased 120%.',
    'SEO results are impressive — organic traffic up 80%.',
    'Great social media presence built. Follower growth of 200%.',
    'Excellent financial management. Audit findings reduced to zero.',
    'Thorough and accurate accountant. Month-end close time reduced.',
    'Strong analytical skills. Financial models built have been instrumental.',
    'Exceptional HR leadership. Employee satisfaction scores up 15%.',
    'Talented recruiter. Time-to-fill reduced by 30%.',
    'Organized and dependable HR coordinator. Onboarding process streamlined.',
    'Outstanding sales leadership. Team exceeded quota by 25%.',
    'Top-performing account executive. 130% of quota achieved.',
    'Promising sales rep with strong work ethic.',
    'Strong business development skills. Generated 50+ qualified leads.',
    'Excellent operations management. Cost reduction of 12% achieved.',
    'Reliable logistics coordinator. On-time delivery rate at 98%.',
    'Sharp supply chain analyst. Inventory optimization saved $200K.',
    'Exceptional UX leadership. User satisfaction scores up 25%.',
    'Talented UI designer with great eye for detail.',
    'Creative graphic designer. Marketing materials quality improved.',
    'Outstanding legal counsel. Zero compliance issues.',
    'Thorough legal analyst. Contract review turnaround improved by 50%.',
    'Excellent support leadership. CSAT scores at all-time high of 96%.',
    'Empathetic and skilled support specialist. First-contact resolution rate of 85%.',
  ][i],
  goals: [
    'Architect the new payment gateway system',
    'Take ownership of a major feature end-to-end',
    'Implement infrastructure-as-code for all environments',
    'Lead the design system initiative',
    'Take on a mentoring role for interns',
    'Achieve 85% automated test coverage',
    'Develop the 2026 marketing strategy roadmap',
    'Launch a podcast series',
    'Expand SEO strategy to international markets',
    'Launch influencer partnership program',
    'Implement rolling forecast model',
    'Pursue CPA certification',
    'Lead the annual budgeting process',
    'Implement employee wellness program',
    'Build employer branding strategy',
    'Lead the HRIS optimization project',
    'Expand into the APAC market',
    'Move into a team lead role',
    'Achieve 100% of quota in Q3',
    'Improve lead-to-close conversion rate',
    'Implement lean manufacturing principles',
    'Optimize warehouse layout',
    'Lead supplier diversity initiative',
    'Establish design ops function',
    'Lead the accessibility improvement initiative',
    'Build a brand asset management system',
    'Develop IP protection strategy',
    'Specialize in employment law',
    'Implement AI-assisted ticket routing',
    'Mentor new support team members',
  ][i],
  improvements: [
    'Continue mentoring; consider presenting at a tech conference',
    'Improve system design documentation skills',
    'Improve cross-team communication during incidents',
    'Deepen backend knowledge for full-stack capability',
    'Participate more actively in architecture discussions',
    'Develop load testing framework for critical paths',
    'Explore AI-driven personalization for campaigns',
    'Improve data analytics skills for content ROI',
    'Improve content writing skills',
    'Develop video content strategy',
    'Mentor junior finance team members',
    'Improve presentation skills for financial reports',
    'Develop expertise in financial planning software',
    'Develop succession planning framework',
    'Improve diversity hiring metrics',
    'Develop conflict resolution skills',
    'Develop strategic partnership program',
    'Improve CRM data hygiene practices',
    'Attend advanced negotiation training',
    'Develop industry-specific expertise',
    'Develop vendor management scorecards',
    'Learn data analytics for logistics optimization',
    'Improve presentation of supply chain insights',
    'Conduct user research for mobile experience',
    'Develop motion design skills',
    'Improve video editing capabilities',
    'Implement legal tech automation tools',
    'Improve legal writing for executive summaries',
    'Develop customer health scoring model',
    'Develop technical troubleshooting expertise',
  ][i],
}));
