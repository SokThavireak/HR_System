import React, { useEffect, useMemo, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import ToastContainer from "../components/common/ToastContainer";
import { useToast } from "../hooks/useToast";
import {
  Button, Input, Select, Badge, LoadingScreen,
  Card, CardHeader, CardTitle, CardContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../components/ui";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";
import { PageTransition } from "../components/ui/page-transition";

/* ─── Inline SVG Icon helper (same pattern as AdminDashboard) ─── */
const Icon = ({ name, size = 18 }) => {
  const s = size;
  const icons = {
    clock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    refresh: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    search: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trash: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    edit: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    download: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    calendar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    zap: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    timer: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    filter: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    alert: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  return icons[name] || null;
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    PRESENT:  { color: "#10b981", label: "Present" },
    LATE:     { color: "#f59e0b", label: "Late" },
    ABSENT:   { color: "#ef4444", label: "Absent" },
    HALF_DAY: { color: "#3b82f6", label: "Half Day" },
    ON_LEAVE: { color: "#8b5cf6", label: "On Leave" },
    IN:       { color: "#10b981", label: "On Shift" },
    OUT:      { color: "#6b7280", label: "Off Shift" },
  };
  const c = map[status] || { color: "#6b7280", label: status || "—" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: c.color + "18", color: c.color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
};

/* ─── localStorage-backed useState ─── */
function useLocalState(key, initial) {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
    return initial;
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }, [key, v]);
  return [v, setV];
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const AttendancePage = ({ showSidebar = true, standalone = false }) => {
  const { toasts, showToast, removeToast } = useToast();

  // Data
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = (() => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); })();
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Manual entry form
  const [manual, setManual] = useState({
    employeeId: "", date: today, clockIn: "09:00", clockOut: "17:00",
    status: "PRESENT", note: "",
  });

  // Edit form
  const [editRecord, setEditRecord] = useState(null);

  // Department data (from AdminDashboard shared state)
  const [departments] = useLocalState("cat-departments", []);
  const [positions] = useLocalState("cat-positions", []);
  const [filterDept, setFilterDept] = useState("");

  // ─── Data Loading ───
  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.allSettled([
        attendanceService.getSummary(),
        attendanceService.getAllAttendance(from, to, filterUserId || undefined, page),
      ]);
      if (sRes.status === "fulfilled") setSummary(sRes.value.data);
      if (rRes.status === "fulfilled") {
        const data = rRes.value.data;
        setRecords(data.content || data || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (e) { showToast("Failed to load attendance", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page]);

  // ─── Computed Stats ───
  const presentCount = useMemo(() => summary?.presentCount ?? records.filter((r) => r.status === "PRESENT").length, [summary, records]);
  const lateCount    = useMemo(() => summary?.lateCount    ?? records.filter((r) => r.status === "LATE").length, [summary, records]);
  const absentCount  = useMemo(() => summary?.absentCount  ?? records.filter((r) => r.status === "ABSENT").length, [summary, records]);
  const totalHours   = useMemo(() => summary?.totalWorkedHours ?? records.reduce((sum, r) => sum + (r.workedHours || 0), 0), [summary, records]);

  const stats = [
    { k: "Present",     v: presentCount,           bg: "#10b981", icon: "check" },
    { k: "Late",        v: lateCount,              bg: "#f59e0b", icon: "clock" },
    { k: "Absent",      v: absentCount,            bg: "#ef4444", icon: "x" },
    { k: "Total Hours", v: `${totalHours.toFixed(1)}h`, bg: "#9a0002", icon: "timer" },
  ];

  // ─── Handlers ───
  const handleManual = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.addManualEntry({ ...manual, employeeId: Number(manual.employeeId) });
      showToast("Manual entry saved! 🎉");
      setManual({ ...manual, clockIn: "", clockOut: "", note: "" });
      loadData();
    } catch { showToast("Save failed", "error"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.updateAttendance(editRecord.id, editRecord);
      showToast("Record updated! ✅");
      setEditRecord(null);
      loadData();
    } catch { showToast("Update failed", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try { await attendanceService.deleteAttendance(id); showToast("Deleted!"); loadData(); }
    catch { showToast("Delete failed", "error"); }
  };

  const handleExport = async () => {
    try {
      const res = await attendanceService.exportReport(from, to, filterUserId || undefined);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_${from}_${to}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast("Exported! 📦");
    } catch { showToast("Export failed", "error"); }
  };

  const startEdit = (r) => {
    setEditRecord({
      id: r.id,
      date: r.date || r.attendanceDate || "",
      clockIn: r.clockIn ? new Date(r.clockIn).toTimeString().slice(0, 5) : "",
      clockOut: r.clockOut ? new Date(r.clockOut).toTimeString().slice(0, 5) : "",
      status: r.status || "PRESENT",
      note: r.note || "",
    });
  };

  const resetFilters = () => {
    setFrom(monthStart);
    setTo(today);
    setFilterUserId("");
    setFilterStatus("");
    setFilterDept("");
    setPage(0);
  };

  // ─── Render ───
  const wrapperClass = standalone ? "p-6 space-y-6" : "space-y-6";

  if (loading && records.length === 0) return <LoadingScreen variant="admin" message="Loading attendance data…" />;

  return (
    <div className={wrapperClass}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── Header ─── */}
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: "#9a0002" }}>
              <Icon name="clock" size={18} />
            </div>
            Attendance Management
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track clock-ins, late arrivals & attendance exceptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="secondary" size="sm">
            <Icon name="refresh" size={14} className="mr-1" /> Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Icon name="download" size={14} className="mr-1" /> Export CSV
          </Button>
        </div>
      </div>
      </ScrollReveal>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.k}>
            <div
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ background: s.bg }}
              >
                <Icon name={s.icon} size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{s.v}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.k}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.1}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon name="filter" size={16} className="text-primary" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="min-w-[150px] flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
              <Input
                type="number" placeholder="All employees" value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
              />
            </div>
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All statuses</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ON_LEAVE">On Leave</option>
              </Select>
            </div>
            {departments.length > 0 && (
              <div className="min-w-[150px] flex-1">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                <Select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                  <option value="">All departments</option>
                  {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </Select>
              </div>
            )}
            <Button onClick={() => { setPage(0); loadData(); }} size="sm">
              <Icon name="search" size={14} /> Apply
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      </ScrollReveal>

      {/* ─── Manual Entry / Edit Form ─── */}
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.15}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon name={editRecord ? "edit" : "plus"} size={16} className="text-primary" />
            {editRecord ? "Edit Attendance Record" : "Manual Clock Entry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editRecord ? handleUpdate : handleManual} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
                <Input
                  type="number" required
                  value={editRecord ? editRecord.employeeId || "" : manual.employeeId}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, employeeId: e.target.value })
                    : setManual({ ...manual, employeeId: e.target.value })
                  }
                  disabled={!!editRecord}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
                <Input
                  type="date" required
                  value={editRecord ? editRecord.date : manual.date}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, date: e.target.value })
                    : setManual({ ...manual, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Clock In</label>
                <Input
                  type="time"
                  value={editRecord ? editRecord.clockIn : manual.clockIn}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, clockIn: e.target.value })
                    : setManual({ ...manual, clockIn: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Clock Out</label>
                <Input
                  type="time"
                  value={editRecord ? editRecord.clockOut : manual.clockOut}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, clockOut: e.target.value })
                    : setManual({ ...manual, clockOut: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={editRecord ? editRecord.status : manual.status}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, status: e.target.value })
                    : setManual({ ...manual, status: e.target.value })
                  }
                >
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="ON_LEAVE">On Leave</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Note</label>
                <Input
                  placeholder="Reason / note…"
                  value={editRecord ? editRecord.note || "" : manual.note}
                  onChange={(e) => editRecord
                    ? setEditRecord({ ...editRecord, note: e.target.value })
                    : setManual({ ...manual, note: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editRecord
                  ? <><Icon name="check" size={14} /> Save Changes</>
                  : <><Icon name="plus" size={14} /> Save Entry</>
                }
              </Button>
              {editRecord && (
                <Button type="button" variant="outline" onClick={() => setEditRecord(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      </ScrollReveal>

      {/* ─── Attendance Table ─── */}
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.2}>
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base">Attendance Log</CardTitle>
          <Badge variant="secondary">{records.length} records</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full rounded-lg loading-shimmer" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">📋</div>
              <p className="text-sm text-muted-foreground">No attendance records found for this filter.</p>
              <p className="text-xs text-muted-foreground">Try adjusting your date range or add a manual entry above.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Worked (hrs)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="font-medium">{r.user?.firstName} {r.user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          #{r.user?.id} {r.user?.department ? `· ${r.user.department}` : ""}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">{r.date || r.attendanceDate}</TableCell>
                      <TableCell className="font-medium" style={{ color: "#10b981" }}>
                        {r.clockIn
                          ? new Date(r.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </TableCell>
                      <TableCell className="font-medium" style={{ color: "#ef4444" }}>
                        {r.clockOut
                          ? new Date(r.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {r.workedHours != null ? r.workedHours : "—"}
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {r.source === "MANUAL" ? (
                            <span className="inline-flex items-center gap-1">
                              <Icon name="edit" size={10} /> Manual
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Icon name="clock" size={10} /> Clock-In
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button
                            title="Edit"
                            onClick={() => startEdit(r)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            <Icon name="edit" size={14} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDelete(r.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      </ScrollReveal>
    </div>
  );
};

export default AttendancePage;
