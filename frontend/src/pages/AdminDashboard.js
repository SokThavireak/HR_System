import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import AttendancePage from './AttendancePage';
import ToastContainer from '../components/common/ToastContainer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const SIDEBAR_ICONS = {
  dashboard: '📊',
  users: '👥',
  attendance: '🕐',
  leaves: '🌴',
  payroll: '💰',
  performance: '⭐',
};

const AdminDashboard = ({ user }) => {
  const [section, setSection] = useState('dashboard');
  const { toasts, showToast, removeToast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [empAddForm, setEmpAddForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    department: '', position: '', baseSalary: '', hireDate: '', role: 'ROLE_EMPLOYEE',
    password: 'changeme',
  });

  const loadStats = async () => {
    try { const { data } = await adminService.getDashboardStats(); setStats(data); }
    catch { showToast('Failed to load stats', 'error'); }
  };

  useEffect(() => { loadStats(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try { const { data } = await adminService.getUsers(search); setUsers(data.content || data); }
    catch { showToast('Failed to load users', 'error'); }
    setLoading(false);
  };

  const loadLeaves = async () => {
    setLoading(true);
    try { const { data } = await adminService.getLeaves('PENDING'); setLeaves(data.content || data); }
    catch { showToast('Failed to load leaves', 'error'); }
    setLoading(false);
  };

  const loadPayrolls = async () => {
    setLoading(true);
    try { const { data } = await adminService.getPayrolls(); setPayrolls(data.content || data); }
    catch { showToast('Failed to load payroll', 'error'); }
    setLoading(false);
  };

  const loadReviews = async () => {
    setLoading(true);
    try { const { data } = await adminService.getReviews(); setReviews(data.content || data); }
    catch { showToast('Failed to load reviews', 'error'); }
    setLoading(false);
  };

  const handleApproveLeave = async (id) => {
    try { await adminService.approveLeave(id); showToast('Leave approved!'); }
    catch { showToast('Approval failed', 'error'); }
    loadLeaves();
  };

  const handleRejectLeave = async (id) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    try { await adminService.rejectLeave(id, reason); showToast('Leave rejected.'); }
    catch { showToast('Reject failed', 'error'); }
    loadLeaves();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try { await adminService.createUser(empAddForm); showToast('Employee created!'); }
    catch { showToast('Failed to create user', 'error'); }
    loadUsers();
  };

  const handleCalculatePayroll = async (userId) => {
    const base = window.prompt('Base salary:');
    const extra = window.prompt('Extra salary:', '0');
    const otHours = window.prompt('Overtime hours:', '0');
    const otRate = window.prompt('OT rate per hour:', '25');
    const tax = window.prompt('Tax deduction:', '0');
    const insurance = window.prompt('Insurance:', '0');
    const other = window.prompt('Other deductions:', '0');
    if (!base) return;
    try {
      await adminService.calculatePayroll({
        userId: Number(userId), baseSalary: Number(base), extraSalary: Number(extra),
        overtimeHours: Number(otHours), overtimeRate: Number(otRate),
        taxDeduction: Number(tax), insuranceDeduction: Number(insurance), otherDeductions: Number(other),
      });
      showToast('Payroll calculated!');
      loadPayrolls();
    } catch { showToast('Calculation failed', 'error'); }
  };

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'users', label: 'User Management' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'leaves', label: 'Leave Approvals' },
    { key: 'payroll', label: 'Payroll' },
    { key: 'performance', label: 'Performance' },
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            HRMS
          </div>
          <span style={{ fontSize: '0.8rem' }}>Admin Portal</span>
        </div>
        <div style={{
          padding: '0 22px 28px', fontSize: '1rem', fontWeight: 700, color: '#334155',
        }}>
          👤 {user?.firstName} {user?.lastName}
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <a key={item.key}
               className={`sidebar-link ${section === item.key ? 'active' : ''}`}
               onClick={() => {
                 setSection(item.key);
                 if (item.key === 'users') loadUsers();
                 if (item.key === 'leaves') loadLeaves();
                 if (item.key === 'payroll') loadPayrolls();
                 if (item.key === 'performance') loadReviews();
               }}>
              <span style={{ fontSize: '1.2rem' }}>{SIDEBAR_ICONS[item.key]}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: '22px', marginTop: 'auto' }}>
          <button className="btn btn-outline" style={{ width: '100%', fontSize: '1rem', fontWeight: 700, padding: '12px' }}
            onClick={() => { localStorage.removeItem('hrms_token'); window.location.reload(); }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------- Main Content ---------- */}
      <div className="main-wrapper">
        <div className="topbar">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{
              fontSize: '1.6rem', marginRight: 6,
              fontWeight: 400,
            }}>{SIDEBAR_ICONS[section] || '📊'}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>
              {sidebarItems.find(s => s.key === section)?.label}
            </h2>
          </div>
          <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="page-content">
          {loading && <LoadingSpinner />}

          {/* ======== DASHBOARD ======== */}
          {section === 'dashboard' && stats && (
            <>
              <h1 className="page-title">
                📊 Overview
              </h1>
              <div className="stats-grid">
                <div className="stat-card" style={{ background: 'var(--stat-pink)' }}>
                  <div className="stat-icon">👥</div>
                  <div className="stat-info"><h3>{stats.totalEmployees}</h3><p>Total Employees</p></div>
                </div>
                <div className="stat-card" style={{ background: 'var(--stat-blue)' }}>
                  <div className="stat-icon">✅</div>
                  <div className="stat-info"><h3>{stats.attendanceRate}%</h3><p>Attendance Rate</p></div>
                </div>
                <div className="stat-card" style={{ background: 'var(--stat-orange)' }}>
                  <div className="stat-icon">🌴</div>
                  <div className="stat-info"><h3>{stats.pendingLeaves}</h3><p>Pending Leaves</p></div>
                </div>
                <div className="stat-card" style={{ background: 'var(--stat-purple)' }}>
                  <div className="stat-icon">💰</div>
                  <div className="stat-info"><h3>${stats.totalPayroll}</h3><p>Monthly Payroll</p></div>
                </div>
              </div>
            </>
          )}

          {/* ======== ATTENDANCE (New Big Page) ======== */}
          {section === 'attendance' && (
            <AttendancePage />
          )}

          {/* ======== USERS ======== */}
          {section === 'users' && (
            <>
              <h1 className="page-title">👥 User Management</h1>

              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header"><span className="card-title">Add New Employee</span></div>
                <form onSubmit={handleCreateUser}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input className="form-control" required value={empAddForm.firstName}
                        onChange={(e) => setEmpAddForm({...empAddForm, firstName: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input className="form-control" required value={empAddForm.lastName}
                        onChange={(e) => setEmpAddForm({...empAddForm, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" type="email" required value={empAddForm.email}
                        onChange={(e) => setEmpAddForm({...empAddForm, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-control" value={empAddForm.phone}
                        onChange={(e) => setEmpAddForm({...empAddForm, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Department</label>
                      <input className="form-control" required value={empAddForm.department}
                        onChange={(e) => setEmpAddForm({...empAddForm, department: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <input className="form-control" required value={empAddForm.position}
                        onChange={(e) => setEmpAddForm({...empAddForm, position: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Base Salary ($)</label>
                      <input className="form-control" type="number" required value={empAddForm.baseSalary}
                        onChange={(e) => setEmpAddForm({...empAddForm, baseSalary: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Hire Date</label>
                      <input className="form-control" type="date" value={empAddForm.hireDate}
                        onChange={(e) => setEmpAddForm({...empAddForm, hireDate: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Role</label>
                      <select className="form-control" value={empAddForm.role}
                        onChange={(e) => setEmpAddForm({...empAddForm, role: e.target.value})}>
                        <option value="ROLE_EMPLOYEE">Employee</option>
                        <option value="ROLE_HR_ADMIN">HR Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Temporary Password</label>
                      <input className="form-control" value={empAddForm.password}
                        onChange={(e) => setEmpAddForm({...empAddForm, password: e.target.value})} />
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">Create Employee</button>
                </form>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Employees ({users.length})</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-control" placeholder="Search..."
                      value={search} onChange={(e) => setSearch(e.target.value)}
                      style={{ width: 220 }} />
                    <button className="btn btn-sm btn-primary" onClick={loadUsers}>Search</button>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Salary</th><th>Role</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.firstName} {u.lastName}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.department}</td>
                          <td>{u.position}</td>
                          <td>${u.baseSalary}</td>
                          <td>
                            <span className={`badge badge-${u.roles?.some(r => r.name === 'ROLE_HR_ADMIN') ? 'info' : 'success'}`}>
                              {u.roles?.some(r => r.name === 'ROLE_HR_ADMIN') ? 'Admin' : 'Employee'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline"
                              onClick={() => showToast(`Edit #${u.id} — coming soon`)}>Edit</button>&nbsp;
                            <button className="btn btn-sm btn-outline" style={{ color: '#E74C3C', borderColor: '#FED7D7' }}
                              onClick={() => {
                                if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) {
                                  adminService.deactivateUser(u.id).then(() => { showToast('Deactivated'); loadUsers(); });
                                }
                              }}>Deactivate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ======== LEAVES ======== */}
          {section === 'leaves' && (
            <>
              <h1 className="page-title">🌴 Leave Approvals</h1>
              <div className="card">
                <div className="card-header"><span className="card-title">Pending Requests ({leaves.length})</span></div>
                {leaves.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>
                    No pending leave requests.
                  </p>
                ) : (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {leaves.map((lv) => (
                          <tr key={lv.id}>
                            <td><strong>{lv.user?.firstName} {lv.user?.lastName}</strong></td>
                            <td>{lv.leaveType}</td>
                            <td>{lv.startDate}</td>
                            <td>{lv.endDate}</td>
                            <td>{lv.totalDays}</td>
                            <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lv.reason}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-success" onClick={() => handleApproveLeave(lv.id)}>✓ Approve</button>&nbsp;
                              <button className="btn btn-sm btn-danger" onClick={() => handleRejectLeave(lv.id)}>✗ Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ======== PAYROLL ======== */}
          {section === 'payroll' && (
            <>
              <h1 className="page-title">💰 Payroll System</h1>
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header"><span className="card-title">Quick Actions</span></div>
                <p style={{ marginBottom: 16, color: 'var(--text-muted)' }}>
                  Calculate: <strong>Net = Base Salary + (Overtime Hours × Rate) + Extra Salary - (Tax + Insurance + Other Deductions)</strong>
                </p>
                <button className="btn btn-primary" onClick={loadPayrolls}>Refresh Payrolls</button>
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">Payroll Records ({payrolls.length})</span></div>
                {payrolls.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No payroll records.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr><th>Employee</th><th>Period</th><th>Base</th><th>OT Pay</th><th>Extra</th><th>Deductions</th><th>Gross</th><th>Net</th><th>Status</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {payrolls.map((pr) => (
                          <tr key={pr.id}>
                            <td>{pr.user?.firstName} {pr.user?.lastName}</td>
                            <td>{pr.payPeriodStart} —<br />{pr.payPeriodEnd}</td>
                            <td>${pr.baseSalary}</td>
                            <td>${pr.overtimePay || 0}</td>
                            <td>${pr.extraSalary || 0}</td>
                            <td>${pr.totalDeductions}</td>
                            <td><strong>${pr.grossSalary}</strong></td>
                            <td><strong style={{ color: 'var(--success)' }}>${pr.netSalary}</strong></td>
                            <td>
                              <span className={`badge badge-${pr.status === 'PAID' ? 'success' : pr.status === 'PROCESSED' ? 'warning' : 'info'}`}>
                                {pr.status}
                              </span>
                            </td>
                            <td>
                              {pr.status === 'DRAFT' && (
                                <button className="btn btn-sm btn-outline" onClick={() => adminService.processPayroll(pr.id).then(() => loadPayrolls())}>
                                  Process
                                </button>
                              )}
                              {pr.status === 'PROCESSED' && (
                                <button className="btn btn-sm btn-success" onClick={() => adminService.payPayroll(pr.id).then(() => loadPayrolls())}>
                                  Mark Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ======== PERFORMANCE ======== */}
          {section === 'performance' && (
            <>
              <h1 className="page-title">⭐ Performance Reviews</h1>

              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header"><span className="card-title">Submit Performance Review</span></div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.target;
                  adminService.createReview({
                    employeeId: Number(f.employeeId.value),
                    reviewPeriodStart: f.periodStart.value,
                    reviewPeriodEnd: f.periodEnd.value,
                    qualityScore: Number(f.quality.value),
                    productivityScore: Number(f.productivity.value),
                    communicationScore: Number(f.communication.value),
                    teamworkScore: Number(f.teamwork.value),
                    punctualityScore: Number(f.punctuality.value),
                    feedback: f.feedback.value,
                    goals: f.goals.value,
                  }).then(() => { showToast('Review submitted!'); loadReviews(); f.reset(); });
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Employee ID</label>
                      <input className="form-control" type="number" name="employeeId" required />
                    </div>
                    <div className="form-group">
                      <label>Period</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="form-control" type="date" name="periodStart" required />
                        <input className="form-control" type="date" name="periodEnd" required />
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Quality (1-5)</label>
                      <input className="form-control" type="number" name="quality" min="1" max="5" required />
                    </div>
                    <div className="form-group">
                      <label>Productivity (1-5)</label>
                      <input className="form-control" type="number" name="productivity" min="1" max="5" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Communication (1-5)</label>
                      <input className="form-control" type="number" name="communication" min="1" max="5" required />
                    </div>
                    <div className="form-group">
                      <label>Teamwork (1-5)</label>
                      <input className="form-control" type="number" name="teamwork" min="1" max="5" required />
                    </div>
                    <div className="form-group">
                      <label>Punctuality (1-5)</label>
                      <input className="form-control" type="number" name="punctuality" min="1" max="5" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Feedback</label>
                    <textarea className="form-control" name="feedback" rows="3" required />
                  </div>
                  <div className="form-group">
                    <label>Goals / Areas of Improvement</label>
                    <textarea className="form-control" name="goals" rows="2" />
                  </div>
                  <button className="btn btn-primary" type="submit">Submit Review</button>
                </form>
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">All Reviews ({reviews.length})</span></div>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No reviews yet.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr><th>Employee</th><th>Period</th><th>Quality</th><th>Productivity</th><th>Overall Score</th><th>Goals</th></tr>
                      </thead>
                      <tbody>
                        {reviews.map((rw) => (
                          <tr key={rw.id}>
                            <td><strong>{rw.employee?.firstName} {rw.employee?.lastName}</strong></td>
                            <td>{rw.reviewPeriodStart} — {rw.reviewPeriodEnd}</td>
                            <td>{rw.qualityScore}/5</td>
                            <td>{rw.productivityScore}/5</td>
                            <td><strong>{rw.overallScore}/5</strong></td>
                            <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rw.goals}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
