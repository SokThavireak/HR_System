import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import AttendancePage from './AttendancePage';
import Icon from '../components/common/Icons';

const SIDEBAR_ICONS = {
  dashboard: 'dashboard',
  users: 'users',
  attendance: 'attendance',
  leaves: 'leaves',
  payroll: 'payroll',
  performance: 'performance',
};

export default function AdminDashboard({ user }) {
  const [section, setSection] = useState('dashboard');

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'users', label: 'User Management' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'leaves', label: 'Leave Approvals' },
    { key: 'payroll', label: 'Payroll' },
    { key: 'performance', label: 'Performance' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ============ SIDEBAR ============ */}
      <aside style={sidebarStyle}>
        <div style={{ padding: '0 24px 36px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7A6BFF', letterSpacing: '-0.03em', lineHeight: 1 }}>HRMS</div>
          <div style={{ fontSize: '0.82rem', color: '#9AA3B5', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>Admin Portal</div>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {sidebarItems.map((item) => (
            <NavLink key={item.key} active={section === item.key}
              icon={SIDEBAR_ICONS[item.key]}
              label={item.label}
              onClick={() => setSection(item.key)}
            />
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button title={user?.email || ''} style={userBtnStyle}>
            <Icon name="user" size={18} color="#5E6B82" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.firstName} {user?.lastName}</span>
          </button>
          <button title="Logout" onClick={() => { localStorage.removeItem('hrms_token'); window.location.reload(); }} style={logoutBtnStyle}>
            <Icon name="logout" size={18} color="#DC2626" />
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div style={{ flex: 1, marginLeft: 290, minHeight: '100vh', background: '#F4F5F9' }}>
        <header style={topbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name={SIDEBAR_ICONS[section] || 'dashboard'} size={28} color="#fff" bold />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>
              {(sidebarItems.find((s) => s.key === section) || {}).label || 'Dashboard'}
            </h1>
          </div>
          <time style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </header>

        <main style={{ padding: 36 }}>
          {section === 'dashboard' && <DashboardView />}
          {section === 'users' && <UserManagementView />}
          {section === 'attendance' && <AttendancePage />}
          {section === 'leaves' && <LeaveApprovalsView />}
          {section === 'payroll' && <PayrollView />}
          {section === 'performance' && <PerformanceView />}
        </main>
      </div>
    </div>
  );
}

/* ──────── shared wrappers ──────── */
const NavLink = ({ active, icon, label, onClick }) => (
  <a onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '13px 18px', marginBottom: 4, borderRadius: 12,
    cursor: 'pointer', fontSize: '1rem', fontWeight: active ? 800 : 600,
    color: active ? '#7A6BFF' : '#64748B',
    background: active ? '#EEECFF' : 'transparent',
    transition: 'all 0.15s', textDecoration: 'none',
  }}>
    <Icon name={icon} size={22} color={active ? '#7A6BFF' : '#8B95A5'} bold={active} />
    <span>{label}</span>
  </a>
);

const sidebarStyle = {
  width: 290, minWidth: 290, background: '#fff',
  borderRight: '1px solid #E8EBF0', display: 'flex',
  flexDirection: 'column', paddingTop: 28,
  position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
};

const userBtnStyle = {
  flex: 1, display: 'flex', alignItems: 'center', gap: 10,
  background: '#F8FAFC', border: '1px solid #E8EBF0', borderRadius: 12,
  padding: '9px 12px', cursor: 'pointer', fontSize: '0.875rem',
  fontWeight: 700, color: '#1E293B',
};

const logoutBtnStyle = {
  width: 44, height: 44, borderRadius: 12, background: '#FEE2E2',
  border: 'none', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};

const topbarStyle = {
  height: 84, background: '#7A6BFF',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 36px', position: 'sticky', top: 0, zIndex: 50, color: '#fff',
};

/* ──────── small reusable tokens ──────── */
const lbl = { display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: 6 };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #E8EBF0', borderRadius: 10, fontSize: '0.95rem', fontWeight: 500, color: '#1E293B', boxSizing: 'border-box' };
const td = { padding: '13px 16px', verticalAlign: 'middle', fontSize: '0.95rem' };
const th = { padding: '14px 16px', textAlign: 'left', background: '#F8FAFC', color: '#5E6B82', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '2px solid #EEF2F7', whiteSpace: 'nowrap' };
const btn = { background: 'linear-gradient(135deg,#7A6BFF,#6556E0)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 };

/* ========================================================================
   DASHBOARD VIEW
   ======================================================================== */
function DashboardView() {
  const [stats, setStats] = React.useState(null);
  React.useEffect(() => { adminService.getDashboardStats().then((r) => setStats(r.data)).catch(() => {}); }, []);
  if (!stats) return null;
  const cards = [
    { icon: 'users', label: 'Total Employees', value: stats.totalEmployees, bg: '#FF8FB3' },
    { icon: 'check', label: 'Attendance Rate', value: `${stats.attendanceRate}%`, bg: '#61D4F8' },
    { icon: 'leaves', label: 'Pending Leaves', value: stats.pendingLeaves, bg: '#FF9B8A' },
    { icon: 'payroll', label: 'Monthly Payroll', value: `$${stats.totalPayroll}`, bg: '#C293FF' },
  ];
  return (
    <>
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E293B', marginBottom: 28 }}>Overview</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: c.bg, padding: '24px 26px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 18, color: '#fff', minHeight: 130, boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={c.icon} size={28} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: 4, opacity: 0.92 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ========================================================================
   USER MANAGEMENT
   ======================================================================== */
function UserManagementView() {
  const [users, setUsers] = useStateLocal('am-users', []);
  const [search, setSearch] = useStateLocal('am-search', '');
  const [form, setForm] = useStateLocal('am-form', { firstName: '', lastName: '', email: '', phone: '', department: '', position: '', baseSalary: '', hireDate: '', role: 'ROLE_EMPLOYEE', password: 'changeme' });
  const [loading, setLoading] = useStateLocal('am-loading', false);

  const load = () => {
    setLoading(true);
    adminService.getUsers(search).then((r) => { setUsers(r.data.content || r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  React.useEffect(load, []);

  const create = async (e) => {
    e.preventDefault();
    await adminService.createUser(form);
    setForm({ ...form, firstName: '', lastName: '', email: '', phone: '', department: '', position: '', baseSalary: '', hireDate: '' });
    load();
  };

  const deactivate = async (u) => { if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) { await adminService.deactivateUser(u.id); load(); } };
  const activate = async (u) => { await adminService.activateUser(u.id); load(); };
  const resetPwd = async (u) => { const pw = prompt('New password:'); if (pw) { await adminService.resetPassword(u.id, pw); } };
  const changeRole = async (u) => { const r = alert ? null : 'ROLE_EMPLOYEE'; if (r) await adminService.updateRole(u.id, r); load(); };

  return (
    <>
      <SectionTitle>User Management</SectionTitle>
      <div style={card}>
        <SectionSubtitle icon="plus" text="Add New Employee" />
        <form onSubmit={create} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
          {[
            { k: 'firstName', l: 'First Name', type: 'text' },
            { k: 'lastName', l: 'Last Name', type: 'text' },
            { k: 'email', l: 'Email', type: 'email' },
            { k: 'phone', l: 'Phone' },
            { k: 'department', l: 'Department' },
            { k: 'position', l: 'Position' },
            { k: 'baseSalary', l: 'Base Salary ($)', type: 'number' },
            { k: 'hireDate', l: 'Hire Date', type: 'date' },
          ].map(({ k, l, type = 'text' }) => (
            <div key={k}><label style={lbl}>{l}</label><input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={inp} /></div>
          ))}
          <div><label style={lbl}>Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inp}><option value="ROLE_EMPLOYEE">Employee</option><option value="ROLE_HR_ADMIN">HR Admin</option></select></div>
          <div><label style={lbl}>Temp Password</label><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inp} /></div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button type="submit" style={btn}><Icon name="plus" size={16} color="#fff" bold /> Create</button></div>
        </form>
      </div>

      <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
        <input placeholder="Search name, email, dept…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inp, maxWidth: 340 }} />
        <button onClick={load} style={btn}><Icon name="search" size={16} color="#fff" bold /> Search</button>
        <button onClick={load} style={{ ...btn, background: '#27AE60' }}><Icon name="refresh" size={16} color="#fff" bold /> Refresh</button>
      </div>

      <div style={card}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 18 }}>Employees <span style={{ color: '#7A6BFF' }}>({users.length})</span></div>
        {loading ? <p>Loading…</p> : !users.length ? <p style={{ color: '#94A3B8' }}>No employees.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead><tr>{['Name', 'Email', 'Department', 'Position', 'Salary', 'Role', 'Status', 'Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = (u.roles || []).some((r) => r.name === 'ROLE_HR_ADMIN');
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F5F7FB' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
                    <td style={td}><strong>{u.firstName} {u.lastName}</strong></td>
                    <td style={td}>{u.email}</td>
                    <td style={td}>{u.department}</td>
                    <td style={td}>{u.position}</td>
                    <td style={td}>${u.baseSalary}</td>
                    <td style={td}><Badge bg={isAdmin ? '#EEECFF' : '#F0FDF4'} fg={isAdmin ? '#7A6BFF' : '#16A34A'} text={isAdmin ? 'Admin' : 'Employee'} /></td>
                    <td style={td}><Badge bg={u.active ? '#F0FDF4' : '#FEE2E2'} fg={u.active ? '#16A34A' : '#DC2626'} text={u.active ? 'Active' : 'Inactive'} /></td>
                    <td style={{ ...td, display: 'flex', gap: 6 }}>
                      <IconBtn icon="edit" color="#7A6BFF" bg="#EEECFF" title="Edit" onClick={() => alert('coming soon')} />
                      {!u.active ? <IconBtn icon="check" color="#16A34A" bg="#F0FDF4" title="Activate" onClick={() => activate(u)} /> : <IconBtn icon="trash" color="#DC2626" bg="#FEE2E2" title="Deactivate" onClick={() => deactivate(u)} />}
                      <IconBtn icon="refresh" color="#D97706" bg="#FEF3C7" title="Reset Pwd" onClick={() => resetPwd(u)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ========================================================================
   LEAVE APPROVALS
   ======================================================================== */
function LeaveApprovalsView() {
  const [leaves, setLeaves] = useStateLocal('al-leaves', []);
  const load = () => adminService.getLeaves('PENDING').then((r) => setLeaves(r.data.content || r.data)).catch(() => {});
  React.useEffect(load, []);
  const approve = (id) => adminService.approveLeave(id).then(load);
  const reject = (id) => { const r = prompt('Reason:'); if (r) adminService.rejectLeave(id, r).then(load); };
  const cancel = (id) => adminService.cancelLeave(id).then(load);
  const details = (id) => adminService.getLeave(id).then((r) => alert(JSON.stringify(r.data, null, 2)));

  return (
    <>
      <SectionTitle>Leave Approvals</SectionTitle>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={load} style={{ ...btn, background: '#27AE60' }}><Icon name="refresh" size={16} color="#fff" bold /> Refresh</button>
      </div>
      <div style={card}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 18 }}>Pending Requests <span style={{ color: '#7A6BFF' }}>({leaves.length})</span></div>
        {!leaves.length ? <p style={{ color: '#94A3B8' }}>No pending requests.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead><tr>{['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {leaves.map((lv) => (
                <tr key={lv.id} style={{ borderBottom: '1px solid #F5F7FB' }}>
                  <td style={td}><strong>{(lv.user || {}).firstName} {(lv.user || {}).lastName}</strong></td>
                  <td style={td}>{lv.leaveType}</td>
                  <td style={td}>{lv.startDate}</td>
                  <td style={td}>{lv.endDate}</td>
                  <td style={td}>{lv.totalDays}</td>
                  <td style={{ ...td, maxWidth: 280 }}>{lv.reason}</td>
                  <td style={{ ...td, display: 'flex', gap: 6 }}>
                    <IconBtn icon="check" color="#16A34A" bg="#F0FDF4" title="Approve" onClick={() => approve(lv.id)} />
                    <IconBtn icon="close" color="#DC2626" bg="#FEE2E2" title="Reject" onClick={() => reject(lv.id)} />
                    <IconBtn icon="eye" color="#7A6BFF" bg="#EEECFF" title="Details" onClick={() => details(lv.id)} />
                    <IconBtn icon="close" color="#D97706" bg="#FEF3C7" title="Cancel" onClick={() => cancel(lv.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ========================================================================
   PAYROLL
   ======================================================================== */
function PayrollView() {
  const [payrolls, setPayrolls] = useStateLocal('ap-payrolls', []);
  const load = () => adminService.getPayrolls().then((r) => setPayrolls(r.data.content || r.data)).catch(() => {});
  React.useEffect(load, []);

  const processRec = (id) => adminService.processPayroll(id).then(load);
  const payRec = (id) => adminService.payPayroll(id).then(load);
  const deleteRec = (id) => { if (confirm('Delete?')) adminService.deletePayroll(id).then(load); };
  const details = (id) => adminService.getPayroll(id).then((r) => alert(JSON.stringify(r.data, null, 2)));

  const calculate = () => {
    const uid = prompt('Employee ID:');
    if (!uid) return;
    const base = prompt('Base salary:') || '0';
    const extra = prompt('Extra salary:', '0') || '0';
    const otHours = prompt('OT hours:', '0') || '0';
    const otRate = prompt('OT rate:', '25') || '25';
    const tax = prompt('Tax:', '0') || '0';
    const ins = prompt('Insurance:', '0') || '0';
    const oth = prompt('Other ded:', '0') || '0';
    adminService.calculatePayroll({ userId: Number(uid), baseSalary: Number(base), extraSalary: Number(extra), overtimeHours: Number(otHours), overtimeRate: Number(otRate), taxDeduction: Number(tax), insuranceDeduction: Number(ins), otherDeductions: Number(oth) }).then(load);
  };

  return (
    <>
      <SectionTitle>Payroll System</SectionTitle>
      <div style={{ display: 'flex', gap: 10, margin: '20px 0', flexWrap: 'wrap' }}>
        <button onClick={load} style={{ ...btn, background: '#27AE60' }}><Icon name="refresh" size={16} color="#fff" bold /> Refresh</button>
        <button onClick={calculate} style={btn}><Icon name="plus" size={16} color="#fff" bold /> Calculate</button>
        <button onClick={() => adminService.bulkProcess().then(load)} style={{ ...btn, background: '#0F766E' }}><Icon name="clock" size={16} color="#fff" bold /> Bulk Process</button>
      </div>
      <div style={card}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 18 }}>Payroll Records <span style={{ color: '#7A6BFF' }}>({payrolls.length})</span></div>
        {!payrolls.length ? <p style={{ color: '#94A3B8' }}>No payroll records.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', minWidth: 900 }}>
              <thead><tr>{['Employee', 'Period', 'Base', 'OT', 'Extra', 'Deductions', 'Gross', 'Net', 'Status', 'Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {payrolls.map((pr) => (
                  <tr key={pr.id} style={{ borderBottom: '1px solid #F5F7FB' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
                    <td style={td}><strong>{(pr.user || {}).firstName} {(pr.user || {}).lastName}</strong></td>
                    <td style={td}>{pr.payPeriodStart}<br />{pr.payPeriodEnd}</td>
                    <td style={td}>${pr.baseSalary}</td>
                    <td style={td}>${pr.overtimePay || 0}</td>
                    <td style={td}>${pr.extraSalary || 0}</td>
                    <td style={td}>${pr.totalDeductions}</td>
                    <td style={{ ...td, fontWeight: 700 }}>${pr.grossSalary}</td>
                    <td style={{ ...td, fontWeight: 700, color: '#16A34A' }}>${pr.netSalary}</td>
                    <td style={td}><Badge bg={pr.status === 'PAID' ? '#F0FDF4' : pr.status === 'PROCESSED' ? '#FEF3C7' : '#EEECFF'} fg={pr.status === 'PAID' ? '#16A34A' : pr.status === 'PROCESSED' ? '#D97706' : '#7A6BFF'} text={pr.status} /></td>
                    <td style={{ ...td, display: 'flex', gap: 6 }}>
                      {pr.status === 'DRAFT' && <IconBtn icon="clock" color="#7A6BFF" bg="#EEECFF" title="Process" onClick={() => processRec(pr.id)} />}
                      {pr.status === 'PROCESSED' && <IconBtn icon="check" color="#16A34A" bg="#F0FDF4" title="Mark Paid" onClick={() => payRec(pr.id)} />}
                      <IconBtn icon="eye" color="#7A6BFF" bg="#EEECFF" title="Details" onClick={() => details(pr.id)} />
                      <IconBtn icon="trash" color="#DC2626" bg="#FEE2E2" title="Delete" onClick={() => deleteRec(pr.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ========================================================================
   PERFORMANCE
   ======================================================================== */
function PerformanceView() {
  const [reviews, setReviews] = useStateLocal('apr-reviews', []);
  const load = () => adminService.getReviews().then((r) => setReviews(r.data.content || r.data)).catch(() => {});
  React.useEffect(load, []);

  const del = (id) => { if (confirm('Delete review?')) adminService.deleteReview(id).then(load); };
  const details = (id) => adminService.getReview(id).then((r) => alert(JSON.stringify(r.data, null, 2)));
  const empPerf = () => { const id = prompt('Employee ID:'); if (id) adminService.getEmployeePerformance(Number(id)).then((r) => alert(JSON.stringify(r.data, null, 2))); };

  return (
    <>
      <SectionTitle>Performance Reviews</SectionTitle>
      <div style={card}>
        <SectionSubtitle icon="plus" text="Submit Review" />
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target;
          adminService.createReview({
            employeeId: Number(f.employeeId.value), reviewPeriodStart: f.periodStart.value, reviewPeriodEnd: f.periodEnd.value,
            qualityScore: Number(f.quality.value), productivityScore: Number(f.productivity.value),
            communicationScore: Number(f.communication.value), teamworkScore: Number(f.teamwork.value),
            punctualityScore: Number(f.punctuality.value), feedback: f.feedback.value, goals: f.goals.value,
          }).then(() => { f.reset(); load(); });
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {[
              { n: 'employeeId', l: 'Employee ID', type: 'number' },
              { n: 'periodStart', l: 'Period Start', type: 'date' },
              { n: 'periodEnd', l: 'Period End', type: 'date' },
              { n: 'quality', l: 'Quality (1-5)', type: 'number' },
              { n: 'productivity', l: 'Productivity (1-5)', type: 'number' },
              { n: 'communication', l: 'Communication (1-5)', type: 'number' },
              { n: 'teamwork', l: 'Teamwork (1-5)', type: 'number' },
              { n: 'punctuality', l: 'Punctuality (1-5)', type: 'number' },
            ].map(({ n, l, type = 'text' }) => (
              <div key={n}><label style={lbl}>{l}</label><input name={n} type={type} min={type === 'number' ? 1 : null} max={type === 'number' ? 5 : null} required style={inp} /></div>
            ))}
          </div>
          <div><label style={lbl}>Feedback</label><textarea name="feedback" rows="3" required style={{ ...inp, width: '100%', boxSizing: 'border-box', resize: 'vertical' }} /></div>
          <div><label style={lbl}>Goals / Areas of Improvement</label><textarea name="goals" rows="2" style={{ ...inp, width: '100%', boxSizing: 'border-box', resize: 'vertical' }} /></div>
          <button type="submit" style={btn}><Icon name="check" size={16} color="#fff" bold /> Submit Review</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0', flexWrap: 'wrap' }}>
        <button onClick={load} style={{ ...btn, background: '#27AE60' }}><Icon name="refresh" size={16} color="#fff" bold /> Refresh</button>
        <button onClick={empPerf} style={btn}><Icon name="users" size={16} color="#fff" bold /> Employee Performance</button>
      </div>

      <div style={card}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 18 }}>All Reviews <span style={{ color: '#7A6BFF' }}>({reviews.length})</span></div>
        {!reviews.length ? <p style={{ color: '#94A3B8' }}>No reviews yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead><tr>{['Employee', 'Period', 'Quality', 'Productivity', 'Overall', 'Goals', 'Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {reviews.map((rw) => (
                <tr key={rw.id} style={{ borderBottom: '1px solid #F5F7FB' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
                  <td style={td}><strong>{(rw.employee || {}).firstName} {(rw.employee || {}).lastName}</strong></td>
                  <td style={td}>{rw.reviewPeriodStart} — {rw.reviewPeriodEnd}</td>
                  <td style={td}>{rw.qualityScore}/5</td>
                  <td style={td}>{rw.productivityScore}/5</td>
                  <td style={{ ...td, fontWeight: 800, color: '#7A6BFF' }}>{rw.overallScore}/5</td>
                  <td style={{ ...td, maxWidth: 260 }}>{rw.goals}</td>
                  <td style={{ ...td, display: 'flex', gap: 6 }}>
                    <IconBtn icon="eye" color="#7A6BFF" bg="#EEECFF" title="Details" onClick={() => details(rw.id)} />
                    <IconBtn icon="trash" color="#DC2626" bg="#FEE2E2" title="Delete" onClick={() => del(rw.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ========================================================================
   TINY REUSABLES
   ======================================================================== */
function SectionTitle({ children }) {
  return <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E293B', marginBottom: 28 }}>{children}</div>;
}
function SectionSubtitle({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <Icon name={icon} size={20} color="#7A6BFF" bold />
      <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{text}</span>
    </div>
  );
}
function Badge({ bg, fg, text }) {
  return <span style={{ padding: '6px 14px', borderRadius: 999, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', background: bg, color: fg, display: 'inline-block' }}>{text}</span>;
}
function IconBtn({ icon, color, bg, title, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 34, height: 34, borderRadius: 10, background: bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: hover ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.1s' }}>
      <Icon name={icon} size={16} color={color} />
    </button>
  );
}

const card = { background: '#fff', borderRadius: 18, padding: '26px 28px', marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' };

/** Tiny localStorage-backed useState (avoids re-typing arrays on hot reload) */
function useStateLocal(key, initial) {
  const [v, setV] = React.useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
    return initial;
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }, [key, v]);
  return [v, setV];
}
