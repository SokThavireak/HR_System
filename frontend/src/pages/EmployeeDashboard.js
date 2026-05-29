import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import AttendancePage from './AttendancePage';
import ToastContainer from '../components/common/ToastContainer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

/* ================================================================
   EmployeeDashboard — Bolder, bigger icons & fonts
   Tabs: Dashboard | Attendance | Leaves | Reports | Profile
   ================================================================ */
const EmployeeDashboard = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [todayRecord, setTodayRecord] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [paySlips, setPaySlips] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [todayRes, summaryRes, leavesRes, slipsRes, perfRes] = await Promise.allSettled([
        employeeService.getToday(),
        employeeService.getDashboardSummary(),
        employeeService.getMyLeaves(),
        employeeService.getPaySlips(),
        employeeService.getPerformance(),
      ]);
      if (todayRes.status === 'fulfilled')  setTodayRecord(todayRes.value.data);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      if (leavesRes.status === 'fulfilled')  setLeaves(leavesRes.value.data);
      if (slipsRes.status === 'fulfilled')    setPaySlips(slipsRes.value.data);
      if (perfRes.status === 'fulfilled')     setPerformance(perfRes.value.data);
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleClock = async () => {
    if (!todayRecord || !todayRecord.clockOutTime) {
      try {
        const { data } = await employeeService.clockIn({});
        setTodayRecord(data);
        showToast('Clocked in successfully!');
      } catch (err) {
        showToast(err.message || 'Clock in failed', 'error');
      }
    } else if (todayRecord.clockInTime && !todayRecord.clockOutTime) {
      try {
        const { data } = await employeeService.clockOut({});
        setTodayRecord(data);
        showToast('Clocked out successfully!');
      } catch (err) {
        showToast(err.message || 'Clock out failed', 'error');
      }
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await employeeService.requestLeave({
        leaveType: form.leaveType.value,
        startDate: form.startDate.value,
        endDate: form.endDate.value,
        reason: form.reason.value,
      });
      showToast('Leave request submitted!');
      form.reset();
      const { data } = await employeeService.getMyLeaves();
      setLeaves(data);
    } catch (err) {
      showToast(err.message || 'Failed to submit', 'error');
    }
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isClockedIn = todayRecord?.clockInTime && !todayRecord?.clockOutTime;
  const isDoneToday = todayRecord?.clockInTime && todayRecord?.clockOutTime;

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ---------- Top Bar ---------- */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: '1.8rem' }}>🏢</span>
          <div>
            <span style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.01em', lineHeight: 1 }}>HRMS</span>
            <span style={{
              marginLeft: 14, fontSize: '1rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600,
            }}>
              Employee Portal
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{
            fontSize: '1.05rem', fontWeight: 700,
            background: 'rgba(255,255,255,0.18)',
            padding: '8px 18px', borderRadius: 999,
          }}>
            👤 {user?.firstName} {user?.lastName}
          </span>
          <button className="btn btn-sm btn-outline" style={{
            background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)',
            color: '#fff', fontSize: '0.95rem', fontWeight: 700,
          }} onClick={() => { localStorage.removeItem('hrms_token'); window.location.reload(); }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* ========= TAB: DASHBOARD ========= */}
        {tab === 'dashboard' && (
          <>
            <h1 className="page-title" style={{ fontSize: '1.8rem' }}>
              👋 Welcome, {user?.firstName}
            </h1>

            {/* Today's Clock Card — bigger */}
            <div className="clock-card" style={{
              padding: '56px 28px',
              borderRadius: 28,
              position: 'relative',
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 10 }}>🕐 Today's Attendance</h3>
              <div className="clock-time" style={{
                fontSize: '3.4rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 24,
              }}>
                {getCurrentTime()}
              </div>
              <button
                className={`clock-btn ${isClockedIn ? 'clocked-out' : ''}`}
                onClick={handleClock}
                disabled={isDoneToday}
                style={{
                  width: 180, height: 180, fontSize: '1.3rem',
                  border: `6px solid ${isClockedIn ? '#FCA5A5' : 'rgba(255,255,255,0.5)'}`,
                }}
              >
                <span style={{ fontSize: '2.2rem', display: 'block' }}>
                  {isClockedIn ? '⏹' : isDoneToday ? '✅' : '▶'}
                </span>
                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isClockedIn ? 'Clock Out' : isDoneToday ? 'Done' : 'Clock In'}
                </span>
              </button>
              <div className="clock-status" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 18 }}>
                {todayRecord?.clockInTime
                  ? `⏰ Clocked in at ${new Date(todayRecord.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : '⏳ Not clocked in yet'}
                {todayRecord?.clockOutTime
                  ? ` · 🌙 Clocked out at ${new Date(todayRecord.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : ''}
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card" style={{ background: 'var(--stat-pink)' }}>
                <div className="stat-icon">✅</div>
                <div className="stat-info"><h3>{summary?.presentDays || 0}</h3><p>Present Days (Month)</p></div>
              </div>
              <div className="stat-card" style={{ background: 'var(--stat-blue)' }}>
                <div className="stat-icon">⏳</div>
                <div className="stat-info"><h3>{summary?.overtimeHours || 0}h</h3><p>Overtime (Accumulated)</p></div>
              </div>
              <div className="stat-card" style={{ background: 'var(--stat-orange)' }}>
                <div className="stat-icon">🌴</div>
                <div className="stat-info"><h3>{summary?.pendingLeaves || 0}</h3><p>Pending Leaves</p></div>
              </div>
              <div className="stat-card" style={{ background: 'var(--stat-purple)' }}>
                <div className="stat-icon">💵</div>
                <div className="stat-info"><h3>${summary?.lastPaySlip || 0}</h3><p>Last Payslip</p></div>
              </div>
            </div>

            {/* Recent Leave Status */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Leave Requests</span>
                <button className="btn btn-sm btn-outline" onClick={() => setTab('leaves')}>View All</button>
              </div>
              {leaves.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>
                  No leave requests yet.
                </p>
              ) : (
                <div className="leave-tracker">
                  {leaves.slice(0, 3).map((lv) => (
                    <div key={lv.id} className={`leave-item ${lv.status.toLowerCase()}`}>
                      <strong>{lv.leaveType}</strong> — {lv.startDate} to {lv.endDate}
                      <span className={`badge badge-${lv.status === 'APPROVED' ? 'success' : lv.status === 'REJECTED' ? 'danger' : 'warning'}`} style={{ marginLeft: 8 }}>
                        {lv.status}
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{lv.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ========= TAB: ATTENDANCE ========= */}
        {tab === 'attendance' && (
          <AttendancePage showSidebar={false} />
        )}

        {/* ========= TAB: LEAVES ========= */}
        {tab === 'leaves' && (
          <>
            <h1 className="page-title">🌴 Leave Management</h1>

            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header"><span className="card-title">Request Time Off</span></div>
              <form onSubmit={handleLeaveSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Leave Type</label>
                    <select className="form-control" name="leaveType" required>
                      <option value="ANNUAL">Annual Leave</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="MATERNITY">Maternity</option>
                      <option value="PATERNITY">Paternity</option>
                      <option value="UNPAID">Unpaid Leave</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input className="form-control" type="date" name="startDate" required />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input className="form-control" type="date" name="endDate" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Reason</label>
                  <textarea className="form-control" name="reason" rows="3" required placeholder="Please describe your reason..." />
                </div>
                <button className="btn btn-primary" type="submit">Submit Request</button>
              </form>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">My Leave History</span></div>
              {leaves.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No leave requests found.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th><th>Reason</th></tr>
                    </thead>
                    <tbody>
                      {leaves.map((lv) => (
                        <tr key={lv.id}>
                          <td>{lv.leaveType}</td>
                          <td>{lv.startDate}</td>
                          <td>{lv.endDate}</td>
                          <td>{lv.totalDays}</td>
                          <td>
                            <span className={`badge badge-${lv.status === 'APPROVED' ? 'success' : lv.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                              {lv.status}
                            </span>
                          </td>
                          <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lv.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========= TAB: PAYSLIPS / REPORTS ========= */}
        {tab === 'reports' && (
          <>
            <h1 className="page-title">📄 Reports &amp; PaySlips</h1>

            <div className="card">
              <div className="card-header"><span className="card-title">My Payslips</span></div>
              {paySlips.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No payslips available.</p>
              ) : (
                paySlips.map((ps) => (
                  <div key={ps.id} className="payslip-card">
                    <div>
                      <strong>Period: {ps.payPeriodStart} — {ps.payPeriodEnd}</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Net Pay: <strong style={{ color: 'var(--success)' }}>${ps.netSalary}</strong> | Gross: ${ps.grossSalary}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-primary">📥 Download</button>
                  </div>
                ))
              )}
            </div>

            <div className="card" style={{ marginTop: 24 }}>
              <div className="card-header"><span className="card-title">Performance Reviews</span></div>
              {performance.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No reviews yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>Period</th><th>Quality</th><th>Productivity</th><th>Overall Score</th><th>Feedback</th></tr>
                    </thead>
                    <tbody>
                      {performance.map((pr) => (
                        <tr key={pr.id}>
                          <td>{pr.reviewPeriodStart} — {pr.reviewPeriodEnd}</td>
                          <td>{pr.qualityScore}/5</td>
                          <td>{pr.productivityScore}/5</td>
                          <td><strong>{pr.overallScore}/5</strong></td>
                          <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========= TAB: PROFILE ========= */}
        {tab === 'profile' && (
          <>
            <h1 className="page-title">👤 My Profile</h1>
            <div className="card">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input className="form-control" defaultValue={user?.firstName} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input className="form-control" defaultValue={user?.lastName} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" defaultValue={user?.email} type="email" readOnly />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-control" defaultValue={user?.department || 'N/A'} readOnly />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input className="form-control" defaultValue={user?.position || 'N/A'} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" defaultValue={user?.phone || '+1 000-000-0000'} />
              </div>
              <button className="btn btn-primary" onClick={() => showToast('Profile updated!', 'success')}>
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

      {/* ---------- Mobile Bottom Navigation ---------- */}
      <nav className="mobile-nav">
        <a className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>
          <span style={{ fontSize: '1.6rem', display: 'block', lineHeight: 1 }}>🏠</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: 2 }}>Home</span>
        </a>
        <a className={tab === 'attendance' ? 'active' : ''} onClick={() => setTab('attendance')}>
          <span style={{ fontSize: '1.6rem', display: 'block', lineHeight: 1 }}>🕐</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: 2 }}>Attendance</span>
        </a>
        <a className={tab === 'leaves' ? 'active' : ''} onClick={() => setTab('leaves')}>
          <span style={{ fontSize: '1.6rem', display: 'block', lineHeight: 1 }}>🌴</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: 2 }}>Leaves</span>
        </a>
        <a className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>
          <span style={{ fontSize: '1.6rem', display: 'block', lineHeight: 1 }}>📄</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: 2 }}>Reports</span>
        </a>
        <a className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
          <span style={{ fontSize: '1.6rem', display: 'block', lineHeight: 1 }}>👤</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: 2 }}>Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default EmployeeDashboard;
