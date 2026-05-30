import React, { useEffect, useMemo, useState } from 'react';
import { attendanceService } from '../services/attendanceService';
import ToastContainer from '../components/common/ToastContainer';
import { useToast } from '../hooks/useToast';

/* ================================================================
   AttendancePage — Big, bold HR attendance management
   - KPI stat cards (large colored squares with big icons)
   - Team grid with live status chips
   - Full attendance log table with manual-entry form
   ================================================================ */

const IN = '#22C55E';
const OUT = '#EF4444';
const LATE = '#F59E0B';
const GREY = '#94A3B8';

const StatusChip = ({ status }) => {
  const map = {
    IN: { bg: '#DCFCE7', fg: IN, label: 'On Shift' },
    OUT: { bg: '#FEE2E2', fg: OUT, label: 'Off Shift' },
    LATE: { bg: '#FEF3C7', fg: LATE, label: 'Late' },
  };
  const c = map[status] || { bg: '#F1F5F9', fg: GREY, label: status || '—' };
  return (
    <span
      style={{
        padding: '8px 18px',
        borderRadius: 999,
        fontWeight: 800,
        fontSize: '0.9rem',
        letterSpacing: '0.03em',
        background: c.bg,
        color: c.fg,
        display: 'inline-block',
      }}
    >
      {c.label}
    </span>
  );
};

const AttendancePage = ({ showSidebar = true }) => {
  const { toasts, showToast, removeToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [userId, setUserId] = useState('');

  /* ---- Manual entry form ---- */
  const [manual, setManual] = useState({
    employeeId: '',
    date: new Date().toISOString().slice(0, 10),
    clockIn: '',
    clockOut: '',
    status: 'PRESENT',
    note: '',
  });

  /* ---- Load data ---- */
  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.allSettled([
        attendanceService.getSummary(),
        attendanceService.getAllAttendance(from, to, userId || undefined),
      ]);
      if (sRes.status === 'fulfilled') setSummary(sRes.value.data);
      if (rRes.status === 'fulfilled') {
        const list = rRes.value.data.content || rRes.value.data || [];
        setRecords(list);
      }
    } catch (e) {
      showToast('Failed to load attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManual = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.addManualEntry({
        ...manual,
        employeeId: Number(manual.employeeId),
      });
      showToast('Manual entry saved!');
      setManual({
        ...manual,
        clockIn: '',
        clockOut: '',
        note: '',
      });
      loadData();
    } catch {
      showToast('Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await attendanceService.deleteAttendance(id);
      showToast('Deleted');
      loadData();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const res = await attendanceService.exportReport(from, to, userId || undefined);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_${from}_${to}.csv`;
      link.click();
      showToast('Exported!');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  /* ---- KPI numbers ---- */
  const presentCount = useMemo(
    () => summary?.presentDays ?? summary?.presentCount ?? records.filter(r => r.status === 'PRESENT').length,
    [summary, records],
  );
  const lateCount = useMemo(
    () => summary?.lateCount ?? records.filter(r => r.status === 'LATE').length,
    [summary, records],
  );
  const absentCount = useMemo(
    () => summary?.absentCount ?? records.filter(r => r.status === 'ABSENT').length,
    [summary, records],
  );
  const totalHours = useMemo(
    () => summary?.totalWorkedHours ?? 0,
    [summary],
  );

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', fontSize: '1.3rem', fontWeight: 700, color: '#2C3E50',
    }}>
      Loading Attendance...
    </div>
  );

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ============ PAGE HEADER ============ */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: '2.4rem', fontWeight: 900,
            color: '#1E293B', letterSpacing: '-0.02em', lineHeight: 1.1,
            marginBottom: 6,
          }}>
            Attendance
          </div>
          <div style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 600 }}>
            Track clock-ins, late arrivals &amp; attendance exceptions
          </div>
        </div>
        <button
          onClick={handleExport}
          style={{
            background: 'linear-gradient(135deg,#7A6BFF,#6556E0)',
            color: '#fff', border: 'none', padding: '14px 28px',
            borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(122,107,255,0.35)',
            letterSpacing: '0.04em',
          }}
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* ============ KPI STRIP ============ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '22px',
        marginBottom: '32px',
      }}>
        {[
          { k: 'Present', v: presentCount, bg: 'linear-gradient(135deg,#22C55E,#16A34A)', icon: '✅', hint: 'Checked in today' },
          { k: 'Late', v: lateCount, bg: 'linear-gradient(135deg,#F59E0B,#D97706)', icon: '⏰', hint: 'Late arrivals' },
          { k: 'Absent', v: absentCount, bg: 'linear-gradient(135deg,#EF4444,#DC2626)', icon: '❌', hint: 'No show / unplanned' },
          { k: 'Total Hrs', v: `${totalHours}h`, bg: 'linear-gradient(135deg,#7A6BFF,#6556E0)', icon: '⏱', hint: 'Hours worked (period)' },
        ].map((s) => (
          <div key={s.k} style={{
            background: s.bg,
            borderRadius: 20,
            padding: '26px 28px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 130,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{
                fontSize: '3.2rem', fontWeight: 900, lineHeight: 1,
                letterSpacing: '-0.03em',
              }}>
                {s.v}
              </div>
              <div style={{
                fontSize: '1.15rem', fontWeight: 800,
                marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {s.k}
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: 4, fontWeight: 500 }}>
                {s.hint}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ FILTERS ============ */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '22px 28px',
        marginBottom: 24, display: 'flex', gap: 14, flexWrap: 'wrap',
        alignItems: 'flex-end', boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      }}>
        <div style={{ minWidth: 160, flex: 1 }}>
          <label style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', marginBottom: 8, display: 'block' }}>From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '2px solid #E2E8F0',
              borderRadius: 12, fontSize: '1rem', fontWeight: 600,
              color: '#1E293B',
            }} />
        </div>
        <div style={{ minWidth: 160, flex: 1 }}>
          <label style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', marginBottom: 8, display: 'block' }}>To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '2px solid #E2E8F0',
              borderRadius: 12, fontSize: '1rem', fontWeight: 600,
              color: '#1E293B',
            }} />
        </div>
        <div style={{ minWidth: 200, flex: 1 }}>
          <label style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', marginBottom: 8, display: 'block' }}>Employee ID</label>
          <input type="number" value={userId} placeholder="All employees"
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '2px solid #E2E8F0',
              borderRadius: 12, fontSize: '1rem', fontWeight: 600,
              color: '#1E293B',
            }} />
        </div>
        <button onClick={loadData}
          style={{
            background: 'linear-gradient(135deg,#7A6BFF,#6556E0)',
            color: '#fff', border: 'none', padding: '14px 32px',
            borderRadius: 12, fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
            letterSpacing: '0.04em',
          }}>
          🔍 Apply Filters
        </button>
      </div>

      {/* ============ MANUAL ENTRY ============ */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px',
        marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 18,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg,#7A6BFF,#6556E0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.4rem', fontWeight: 900,
          }}>＋</div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>
            Manual Clock Entry
          </span>
        </div>

        <form onSubmit={handleManual}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            <div>
              <label style={lbl}>Employee ID</label>
              <input type="number" required
                value={manual.employeeId}
                onChange={(e) => setManual({ ...manual, employeeId: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Date</label>
              <input type="date" required
                value={manual.date}
                onChange={(e) => setManual({ ...manual, date: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Clock In (HH:MM)</label>
              <input type="time"
                value={manual.clockIn}
                onChange={(e) => setManual({ ...manual, clockIn: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Clock Out (HH:MM)</label>
              <input type="time"
                value={manual.clockOut}
                onChange={(e) => setManual({ ...manual, clockOut: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select value={manual.status}
                onChange={(e) => setManual({ ...manual, status: e.target.value })}
                style={inp}>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
            <div style={{ minWidth: 220, flex: 2 }}>
              <label style={lbl}>Note</label>
              <input placeholder="Reason / note"
                value={manual.note}
                onChange={(e) => setManual({ ...manual, note: e.target.value })}
                style={inp} />
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <button type="submit"
              style={{
                background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                color: '#fff', border: 'none', padding: '14px 36px',
                borderRadius: 12, fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
                letterSpacing: '0.04em',
                boxShadow: '0 6px 20px rgba(34,197,94,0.3)',
              }}>
              ✓ Save Entry
            </button>
          </div>
        </form>
      </div>

      {/* ============ FULL TABLE ============ */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          fontSize: '1.5rem', fontWeight: 900, color: '#1E293B', marginBottom: 18,
        }}>
          Attendance Log
          <span style={{
            marginLeft: 12, fontSize: '1rem', fontWeight: 700,
            background: '#EEF2FF', color: '#6366F1',
            padding: '6px 16px', borderRadius: 999,
          }}>
            {records.length} records
          </span>
        </div>

        {records.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: '#94A3B8', fontSize: '1.1rem', fontWeight: 600,
          }}>
            No attendance records found for this filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'separate',
              borderSpacing: 0, fontSize: '1rem',
            }}>
              <thead>
                <tr>
                  {['Employee', 'Date', 'Clock In', 'Clock Out', 'Worked (hrs)', 'Status', 'Source', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '18px 20px', textAlign: 'left',
                      background: '#F8FAFC', color: '#475569',
                      fontSize: '0.95rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '2px solid #E2E8F0',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={td}>
                      <div style={{ fontWeight: 800, color: '#1E293B' }}>
                        {r.user?.firstName} {r.user?.lastName}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                        #{r.user?.id} · {r.user?.department || ''}
                      </div>
                    </td>
                    <td style={{ ...td, fontWeight: 700 }}>{r.date || r.attendanceDate}</td>
                    <td style={{ ...td, fontWeight: 700, color: '#16A34A' }}>
                      {r.clockIn
                        ? new Date(r.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td style={{ ...td, fontWeight: 700, color: '#DC2626' }}>
                      {r.clockOut
                        ? new Date(r.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td style={{ ...td, fontWeight: 800 }}>
                      {r.workedHours != null ? r.workedHours : '—'}
                    </td>
                    <td style={td}>
                      <StatusChip status={r.status === 'PRESENT' ? 'IN' : r.status === 'LATE' ? 'LATE' : r.status === 'ABSENT' ? 'OUT' : 'OUT'} />
                    </td>
                    <td style={{ ...td, fontSize: '0.9rem', color: '#64748B' }}>
                      {r.source || 'CLOCK-IN'}
                    </td>
                    <td style={td}>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{
                          background: '#FEE2E2', color: '#DC2626',
                          border: 'none', padding: '8px 16px', borderRadius: 10,
                          fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                        }}
                      >🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const lbl = {
  display: 'block', fontSize: '0.95rem', fontWeight: 800,
  color: '#334155', marginBottom: 8,
};
const inp = {
  width: '100%', padding: '12px 16px', border: '2px solid #E2E8F0',
  borderRadius: 12, fontSize: '1rem', fontWeight: 600,
  color: '#1E293B', boxSizing: 'border-box',
  transition: 'border 0.15s',
};
const td = {
  padding: '16px 20px',
  borderBottom: '1px solid #F1F5F9',
  fontSize: '1rem',
  verticalAlign: 'middle',
};

export default AttendancePage;
