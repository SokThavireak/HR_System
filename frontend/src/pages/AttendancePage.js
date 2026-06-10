import React, { useEffect, useMemo, useState, useRef } from "react";
import { attendanceService } from "../services/attendanceService";
import ToastContainer from "../components/common/ToastContainer";
import { useToast } from "../hooks/useToast";
import {
  Button, Input, Select, Badge, Card, CardHeader, CardTitle, CardContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  AttendancePageSkeleton, Modal
} from "../components/ui";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";

/* ─── Inline SVG Icon helper ─── */
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
    timer: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    calendar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    filter: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    chevronDown: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    xCircle: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  };
  return icons[name] || null;
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    PRESENT: { color: "#10b981", label: "Present" },
    LATE: { color: "#f59e0b", label: "Late" },
    ABSENT: { color: "#ef4444", label: "Absent" },
    HALF_DAY: { color: "#3b82f6", label: "Half Day" },
    ON_LEAVE: { color: "#8b5cf6", label: "On Leave" },
  };
  const c = map[status] || { color: "#6b7280", label: status || "—" };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: c.color + "18", color: c.color }}>
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
};

/* ─── Generate seed data for current year (work days only) ─── */
function buildSeedData() {
  const firstNames = ['Sophia','Marcus','Priya','David','Aisha','Carlos','Emily','James','Olga','Raj','Lisa','Mohammed','Fatima','Anna','Kevin','Nguyen','Robert','Sara','Daniel','Mei','Peter','Linda','Omar','Isabella','Tom','Nadia','William','Claire','Alex','Jenny'];
  const lastNames = ['Chen','Johnson','Patel','Kim','Ahmed','Reyes','Wang','Martin','Smirnova','Gupta','Thompson','Ali','Hassan','Mueller','Brown','Tran','Wilson','Dupont','Lee','Lin','Jones','Zhang','Farouk','Rossi','Harris','Petrova','Scott','Dubois','Morgan','Adams'];
  const depts = ['Engineering','Engineering','Engineering','Engineering','Engineering','Engineering','Marketing','Marketing','Marketing','Marketing','Finance','Finance','Finance','Human Resources','Human Resources','Human Resources','Sales','Sales','Sales','Sales','Operations','Operations','Operations','Design','Design','Design','Legal','Legal','Customer Support','Customer Support'];

  const now = new Date();
  const curYear = now.getFullYear();

  const workDays = [];
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= new Date(curYear, m + 1, 0).getDate(); d++) {
      const day = new Date(curYear, m, d);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        workDays.push(curYear + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'));
      }
    }
  }

  const seed = [];
  let id = 1;
  for (let uid = 2; uid <= 31; uid++) {
    workDays.forEach((date, idx) => {
      let status = 'PRESENT';
      let hours = 8.0;
      let lateMin = 0;
      const ciMin = 45 + idx % 15;
      const coMin = 5 + idx % 25;
      let clockIn = date + 'T08:' + String(ciMin).padStart(2, '0') + ':00';
      let clockOut = date + 'T17:' + String(coMin).padStart(2, '0') + ':00';

      if (uid % 7 === 0 && idx % 5 === 0) {
        status = 'LATE';
        lateMin = 15 + (idx % 3) * 10;
        const lateClockMin = 15 + lateMin;
        clockIn = date + 'T09:' + String(lateClockMin).padStart(2, '0') + ':00';
        clockOut = date + 'T17:' + String(lateClockMin).padStart(2, '0') + ':00';
      } else if (uid % 11 === 0 && idx % 8 === 0) {
        status = 'ABSENT';
        hours = 0;
        lateMin = 0;
        clockIn = null;
        clockOut = null;
      } else if (uid % 5 === 0 && idx % 10 === 0) {
        status = 'HALF_DAY';
        hours = 4.0;
        clockIn = date + 'T09:00:00';
        clockOut = date + 'T13:00:00';
      }
      seed.push({
        id: id++,
        user: { id: uid, employeeId: String(uid - 1).padStart(6, '0'), firstName: firstNames[uid - 2], lastName: lastNames[uid - 2], department: depts[uid - 2] },
        date,
        clockInTime: clockIn,
        clockOutTime: clockOut,
        hoursWorked: hours,
        status,
        lateMinutes: lateMin,
        overtimeHours: hours > 8 ? hours - 8 : 0,
      });
    });
  }
  return seed;
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const AttendancePage = ({ showSidebar = true, standalone = false, admin = false, user = null }) => {
  const { toasts, showToast, removeToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [usingApiData, setUsingApiData] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");

  // ─── Employee detection (must be before filter state init) ───
  const isEmployee = !admin && user != null;

  // Initialize admin-only filters empty for employees (skip localStorage)
  const initFilter = (key, defaultVal) => {
    if (isEmployee) return "";
    return localStorage.getItem(key) || defaultVal;
  };

  // ─── Filter state ───
  const today = new Date().toISOString().slice(0, 10);
  const curYear = new Date().getFullYear();
  const curMonth = new Date().getMonth() + 1;

  const [filterType, setFilterType] = useState(() => {
    // Clear stale filter keys and default to "all"
    localStorage.setItem("att_filterType", "all");
    localStorage.removeItem("att_filterUserId");
    localStorage.removeItem("att_filterName");
    localStorage.removeItem("att_filterStatus");
    localStorage.removeItem("att_filterDept");
    return "all";
  });
  const [filterDay, setFilterDay] = useState(() => localStorage.getItem("att_filterDay") || today);
  const [filterStartDate, setFilterStartDate] = useState(() => localStorage.getItem("att_filterStartDate") || today);
  const [filterEndDate, setFilterEndDate] = useState(() => localStorage.getItem("att_filterEndDate") || today);
  const [filterMonth, setFilterMonth] = useState(() => localStorage.getItem("att_filterMonth") || String(curMonth));
  const [filterYear, setFilterYear] = useState(() => localStorage.getItem("att_filterYear") || String(curYear));
  const [filterName, setFilterName] = useState(() => initFilter("att_filterName", ""));
  const [filterId, setFilterId] = useState(() => initFilter("att_filterId", ""));
  const [filterIdInput, setFilterIdInput] = useState(() => initFilter("att_filterId", ""));
  const [filterUserId, setFilterUserId] = useState(() => initFilter("att_filterUserId", ""));
  const [filterUserIdInput, setFilterUserIdInput] = useState(() => initFilter("att_filterUserId", ""));
  const [filterLetter, setFilterLetter] = useState(() => initFilter("att_filterLetter", ""));
  const [filterStatus, setFilterStatus] = useState(() => localStorage.getItem("att_filterStatus") || "");
  const [filterDept, setFilterDept] = useState(() => initFilter("att_filterDept", ""));

  // Auto-filter for non-admin employees — lock to their own record
  const effectiveFilterUserId = isEmployee ? String(user?.id || "") : filterUserId;


  const [manual, setManual] = useState({ employeeId: "", date: today, clockIn: "09:00", clockOut: "17:00", status: "PRESENT", note: "" });
  const [editRecord, setEditRecord] = useState(null);

  // ─── Persist filter state to localStorage (date filters only for employees) ───
  useEffect(() => { localStorage.setItem("att_filterType", filterType); }, [filterType]);
  useEffect(() => { localStorage.setItem("att_filterDay", filterDay); }, [filterDay]);
  useEffect(() => { localStorage.setItem("att_filterStartDate", filterStartDate); }, [filterStartDate]);
  useEffect(() => { localStorage.setItem("att_filterEndDate", filterEndDate); }, [filterEndDate]);
  useEffect(() => { localStorage.setItem("att_filterMonth", filterMonth); }, [filterMonth]);
  useEffect(() => { localStorage.setItem("att_filterYear", filterYear); }, [filterYear]);
  useEffect(() => { localStorage.setItem("att_filterStatus", filterStatus); }, [filterStatus]);
  useEffect(() => { if (!isEmployee) localStorage.setItem("att_filterName", filterName); }, [filterName, isEmployee]);
  useEffect(() => { if (!isEmployee) localStorage.setItem("att_filterId", filterId); }, [filterId, isEmployee]);
  useEffect(() => { if (!isEmployee) localStorage.setItem("att_filterUserId", filterUserId); }, [filterUserId, isEmployee]);
  // Sync committed filter values → input fields (for initial load from localStorage)
  useEffect(() => { setFilterIdInput(filterId); }, [filterId]);
  useEffect(() => { setFilterUserIdInput(filterUserId); }, [filterUserId]);
  useEffect(() => { if (!isEmployee) localStorage.setItem("att_filterLetter", filterLetter); }, [filterLetter, isEmployee]);
  useEffect(() => { if (!isEmployee) localStorage.setItem("att_filterDept", filterDept); }, [filterDept, isEmployee]);

  // ─── Build seed data ONCE ───
  const seedData = useMemo(() => buildSeedData(), []);

  // ─── Compute date range from filter type ───
  const dateRange = useMemo(() => {
    if (filterType === "all") {
      return { from: null, to: null };
    }
    if (filterType === "range") {
      return { from: filterStartDate, to: filterEndDate };
    }
    if (filterType === "day") {
      return { from: filterDay, to: filterDay };
    }
    if (filterType === "month") {
      const m = Number(filterMonth);
      const y = Number(filterYear);
      const start = y + '-' + String(m).padStart(2, '0') + '-01';
      const end = y + '-' + String(m).padStart(2, '0') + '-' + String(new Date(y, m, 0).getDate());
      return { from: start, to: end };
    }
    const y = Number(filterYear);
    return { from: y + '-01-01', to: y + '-12-31' };
  }, [filterType, filterDay, filterStartDate, filterEndDate, filterMonth, filterYear]);

  // ─── Fetch data from API when date range changes ───
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setApiLoading(true);
    setLoading(true);

    const fetchPromise = isEmployee
      ? attendanceService.getMyAttendance(dateRange.from, dateRange.to)
      : attendanceService.getAllAttendance(dateRange.from, dateRange.to, null, 0, 2000, filterId || null, effectiveFilterUserId || null);

    fetchPromise
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.content || res.data || [];
        setRecords(data);
        setUsingApiData(true);
      })
      .catch(() => {
        if (cancelled) return;
        setRecords([]);
        setUsingApiData(false);
      })
      .finally(() => {
        if (cancelled) return;
        setApiLoading(false);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [dateRange, seedData, effectiveFilterUserId, filterId, isEmployee, refreshTrigger]);

  // ─── Filter + Sort records ───
  const filtered = useMemo(() => {
    let result = records.filter((a) => {
      const d = a.date;
      if (dateRange.from && dateRange.to && (d < dateRange.from || d > dateRange.to)) return false;
      if (filterStatus && a.status !== filterStatus) return false;
      if (filterDept && a.user?.department !== filterDept) return false;
      if (filterId && String(a.id) !== String(filterId)) return false;
      if (isEmployee) {
        if (String(a.user?.id) !== String(user?.id)) return false;
      } else {
        if (filterUserId && String(a.user?.employeeId || "").toLowerCase() !== filterUserId.toLowerCase()) return false;
      }
      if (filterName) {
        const name = ((a.user?.firstName || '') + ' ' + (a.user?.lastName || '')).toLowerCase();
        if (!name.includes(filterName.toLowerCase())) return false;
      }
      if (filterLetter) {
        const firstChar = (a.user?.firstName || '').charAt(0).toUpperCase();
        if (firstChar !== filterLetter) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      const cmp = sortDirection === "desc" 
        ? (b.date || "").localeCompare(a.date || "") 
        : (a.date || "").localeCompare(b.date || "");
      if (cmp !== 0) return cmp;
      const nameA = ((a.user?.firstName || '') + ' ' + (a.user?.lastName || '')).toLowerCase();
      const nameB = ((b.user?.firstName || '') + ' ' + (b.user?.lastName || '')).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return result;
  }, [records, dateRange, filterStatus, filterDept, filterName, filterId, effectiveFilterUserId, filterLetter, sortDirection]);



  // ─── Loading + pagination ───
  useEffect(() => {
    setTotalPages(Math.ceil(filtered.length / 20));
    setPage(0);
    // Safety: always stop loading after filters produce a result
    if (loading) setLoading(false);
  }, [filtered]);

  // ─── Determine if viewing a single user ───
  const targetUser = useMemo(() => {
    if (filtered.length === 0) return null;
    const firstUser = filtered[0].user;
    if (!firstUser || !firstUser.id) return null;
    if (filtered.every((r) => r.user?.id === firstUser.id)) return firstUser;
    return null;
  }, [filtered]);

  // ─── Stats ───
  const presentCount = filtered.filter((r) => r.status === "PRESENT").length;
  const lateCount = filtered.filter((r) => r.status === "LATE").length;
  const absentCount = filtered.filter((r) => r.status === "ABSENT").length;
  const totalHours = filtered.reduce((s, r) => s + (r.hoursWorked || r.workedHours || 0), 0);
  
  const totalDays = presentCount + lateCount + absentCount;
  let attendanceRate = "-";
  if (totalDays > 0) {
    const score = (presentCount * 5 + lateCount * 3 + absentCount * 1) / totalDays;
    attendanceRate = Math.max(1, Math.min(5, score)).toFixed(1);
  }

  const stats = [
    { k: "Present", v: presentCount, bg: "#10b981", icon: "check" },
    { k: "Late", v: lateCount, bg: "#f59e0b", icon: "clock" },
    { k: "Absent", v: absentCount, bg: "#ef4444", icon: "x" },
    { k: "Total Hours", v: totalHours.toFixed(1) + "h", bg: "#9a0002", icon: "timer" },
  ];

  // ─── Leave stats (only when single user) ───
  const leaveStats = targetUser ? [
    { k: "Rating (/5)", v: attendanceRate, bg: "#6366f1", icon: "check" },
    { k: "IL Left", v: (targetUser.ilLeaveEntitlement || 0) - (targetUser.ilLeaveUsed || 0), bg: "#3b82f6", icon: "calendar" },
    { k: "Sick Left", v: (targetUser.sickLeaveEntitlement || 0) - (targetUser.sickLeaveUsed || 0), bg: "#f59e0b", icon: "calendar" },
    { k: "Special Left", v: (targetUser.specialLeaveEntitlement || 0) - (targetUser.specialLeaveUsed || 0), bg: "#8b5cf6", icon: "calendar" },
  ] : [];

  // ─── Handlers ───
  const handleManual = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.addManualEntry({ ...manual, employeeId: Number(manual.employeeId) });
      showToast("Manual entry saved!");
      setManual({ ...manual, clockIn: "", clockOut: "", note: "" });
      setRefreshTrigger(prev => prev + 1);
    } catch { showToast("Save failed", "error"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.updateAttendance(editRecord.id, editRecord);
      showToast("Record updated!");
      setEditRecord(null);
      setRefreshTrigger(prev => prev + 1);
    } catch { showToast("Update failed", "error"); }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      await attendanceService.deleteAttendance(id);
      showToast("Deleted!");
      setRefreshTrigger(prev => prev + 1);
    } catch { showToast("Delete failed", "error"); }
    finally { setActionLoading(null); setDeleteConfirm(null); }
  };

  const startEdit = (r) => {
    setEditRecord({
      id: r.id, date: r.date || "",
      clockIn: r.clockInTime ? r.clockInTime.slice(11, 16) : "",
      clockOut: r.clockOutTime ? r.clockOutTime.slice(11, 16) : "",
      status: r.status || "PRESENT", note: r.note || "",
    });
  };

  // Commit ID filters (called on Enter key or button click)
  const commitIdFilters = () => {
    setFilterId(filterIdInput.trim());
    setFilterUserId(filterUserIdInput.trim());
  };

  const handleIdKeyDown = (e) => {
    if (e.key === "Enter") commitIdFilters();
  };

  const resetFilters = () => {
    setFilterType("month");
    setFilterDay(today);
    setFilterMonth(String(curMonth));
    setFilterYear(String(curYear));
    setFilterName("");
    setFilterId("");
    setFilterIdInput("");
    setFilterUserId("");
    setFilterUserIdInput("");
    setFilterLetter("");
    setFilterStatus("");
    setFilterDept("");
    setPage(0);
  };

  const showAll = () => {
    setFilterType("all");
    setFilterName("");
    setFilterId("");
    setFilterIdInput("");
    setFilterUserId("");
    setFilterUserIdInput("");
    setFilterLetter("");
    setFilterStatus("");
    setFilterDept("");
    setPage(0);
  };

  const removeChip = (key) => {
    if (key === "name") setFilterName("");
    if (key === "id") { setFilterId(""); setFilterIdInput(""); }
    if (key === "userId") { setFilterUserId(""); setFilterUserIdInput(""); }
    if (key === "letter") setFilterLetter("");
    if (key === "status") setFilterStatus("");
    if (key === "dept") setFilterDept("");
  };

  const hasActiveFilters = filterName || filterId || filterUserId || filterLetter || filterStatus || filterDept;

  // ─── Month options ───
  const monthOptions = [
    { value: "1", label: "Jan" }, { value: "2", label: "Feb" },
    { value: "3", label: "Mar" }, { value: "4", label: "Apr" },
    { value: "5", label: "May" }, { value: "6", label: "Jun" },
    { value: "7", label: "Jul" }, { value: "8", label: "Aug" },
    { value: "9", label: "Sep" }, { value: "10", label: "Oct" },
    { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => String(curYear - 2 + i));

  const wrapperClass = standalone ? "p-6 space-y-6" : "space-y-6";

  // Loading skeleton
  if (loading) {
    return <AttendancePageSkeleton />;
  }

  return (
    <div className={wrapperClass}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: "#9a0002" }}>
                <Icon name="clock" size={18} />
              </div>
              Attendance Management
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Track clock-ins, late arrivals & attendance exceptions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={showAll} variant="secondary" size="sm"><Icon name="calendar" size={14} className="mr-1" /> Show All</Button>
            <Button onClick={resetFilters} variant="secondary" size="sm"><Icon name="refresh" size={14} className="mr-1" /> Reset</Button>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...stats, ...leaveStats].map((s) => (
          <StaggerItem key={s.k}>
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: s.bg }}><Icon name={s.icon} size={20} /></div>
              <div><p className="text-2xl font-bold leading-none">{s.v}</p><p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.k}</p></div>
            </div>
          </StaggerItem>
        ))}
      </div>

      {/* ═══ NEW FILTER PANEL ═══ */}
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.1}>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Filter header bar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon name="filter" size={15} className="text-primary" />
              Filters
              {apiLoading && (
                <span className="ml-2 inline-flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                  Loading…
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {usingApiData && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">Live Data</span>
              )}
              {!isEmployee && (
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Advanced
                  <Icon name="chevronDown" size={12} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Main filter row */}
          {isEmployee ? (
            <div className="flex flex-wrap items-center justify-between p-3" style={{ background: "rgba(154,0,2,0.03)" }}>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg bg-white border border-gray-200 p-0.5">
                  {(["all", "day", "month", "year", "range"]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                        filterType === t
                          ? "bg-[#9a0002] text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {filterType === "day" && (
                  <div className="flex items-center gap-1.5">
                    <Icon name="calendar" size={14} className="text-muted-foreground" />
                    <Input type="date" value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="h-8 w-auto text-xs" />
                  </div>
                )}

                {filterType === "range" && (
                  <div className="flex items-center gap-1.5">
                    <Icon name="calendar" size={14} className="text-muted-foreground" />
                    <Input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="h-8 w-auto text-xs" />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="h-8 w-auto text-xs" />
                  </div>
                )}

                {filterType === "month" && (
                  <div className="flex items-center gap-1.5">
                    <Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="h-8 w-auto text-xs">
                      {monthOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </Select>
                    <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="h-8 w-auto text-xs">
                      {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                    </Select>
                  </div>
                )}

                {filterType === "year" && (
                  <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="h-8 w-auto text-xs">
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </Select>
                )}

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 w-auto min-w-[110px] text-xs">
                  <option value="">All Status</option>
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="ON_LEAVE">On Leave</option>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-white border border-gray-200 text-muted-foreground shadow-sm">
                  <Icon name="user" size={12} /> My Records
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 p-3">
              <div className="flex rounded-lg bg-gray-100 p-0.5">
                {(["all", "day", "month", "year", "range"]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                      filterType === t
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {filterType === "day" && (
                <div className="flex items-center gap-1.5">
                  <Icon name="calendar" size={14} className="text-muted-foreground" />
                  <Input type="date" value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="h-8 w-auto text-xs" />
                </div>
              )}

              {filterType === "range" && (
                <div className="flex items-center gap-1.5">
                  <Icon name="calendar" size={14} className="text-muted-foreground" />
                  <Input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="h-8 w-auto text-xs" />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="h-8 w-auto text-xs" />
                </div>
              )}

              {filterType === "month" && (
                <div className="flex items-center gap-1.5">
                  <Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="h-8 w-auto text-xs">
                    {monthOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Select>
                  <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="h-8 w-auto text-xs">
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </Select>
                </div>
              )}

              {filterType === "year" && (
                <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="h-8 w-auto text-xs">
                  {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                </Select>
              )}

              <div className="mx-1 h-5 w-px bg-gray-200" />

              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 w-auto min-w-[110px] text-xs">
                <option value="">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ON_LEAVE">On Leave</option>
              </Select>

              <Select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="h-8 w-auto min-w-[130px] text-xs">
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Design">Design</option>
                <option value="Legal">Legal</option>
                <option value="Customer Support">Customer Support</option>
              </Select>

              <div className="mx-1 h-5 w-px bg-gray-200" />

              <div className="relative w-36">
                <span className="pointer-events-none absolute left-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground">
                  <Icon name="search" size={13} />
                </span>
                <Input
                  placeholder="User ID…"
                  value={filterUserIdInput}
                  onChange={(e) => setFilterUserIdInput(e.target.value)}
                  onKeyDown={handleIdKeyDown}
                  className="h-8 w-full pl-8 pr-6 text-xs"
                />
                {filterUserIdInput && (
                  <button onClick={() => { setFilterUserIdInput(""); setFilterUserId(""); }} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                    <Icon name="x" size={12} />
                  </button>
                )}
              </div>

              <div className="relative w-36">
                <span className="pointer-events-none absolute left-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground">
                  <Icon name="search" size={13} />
                </span>
                <Input
                  type="number"
                  placeholder="Record ID…"
                  value={filterIdInput}
                  onChange={(e) => setFilterIdInput(e.target.value)}
                  onKeyDown={handleIdKeyDown}
                  className="h-8 w-full pl-8 pr-6 text-xs"
                />
                {filterIdInput && (
                  <button onClick={() => { setFilterIdInput(""); setFilterId(""); }} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                    <Icon name="x" size={12} />
                  </button>
                )}
              </div>

              <Button onClick={commitIdFilters} variant="primary" size="sm" className="h-8 text-xs">
                <Icon name="search" size={13} className="mr-1" /> Search
              </Button>

              <div className="flex-1" />

              <span className="text-xs font-medium text-muted-foreground">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Advanced filters row (collapsible) */}
          {showAdvanced && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/50 px-3 py-2.5">
              <div className="relative w-52">
                <span className="pointer-events-none absolute left-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground">
                  <Icon name="search" size={13} />
                </span>
                <Input
                  placeholder="Search employee name…"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="h-8 w-full pl-8 text-xs"
                />
              </div>

              <Select value={filterLetter} onChange={(e) => setFilterLetter(e.target.value)} className="h-8 w-auto text-xs">
                <option value="">All Letters</option>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>

              <div className="flex-1" />

              <Button onClick={showAll} variant="ghost" size="sm" className="h-8 text-xs">
                <Icon name="calendar" size={13} className="mr-1" /> Show All
              </Button>
              <Button onClick={resetFilters} variant="ghost" size="sm" className="h-8 text-xs">
                <Icon name="refresh" size={13} className="mr-1" /> Reset
              </Button>
            </div>
          )}



          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Active:</span>
              {filterName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Name: {filterName}
                  <button onClick={() => removeChip("name")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              {filterId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Record ID: {filterId}
                  <button onClick={() => removeChip("id")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              {filterUserId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  User ID: {filterUserId}
                  <button onClick={() => removeChip("userId")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              {filterStatus && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Status: {filterStatus}
                  <button onClick={() => removeChip("status")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              {filterDept && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Dept: {filterDept}
                  <button onClick={() => removeChip("dept")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              {filterLetter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Letter: {filterLetter}
                  <button onClick={() => removeChip("letter")} className="ml-0.5 rounded-full hover:bg-primary/15 cursor-pointer"><Icon name="x" size={10} /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="ml-auto text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Attendance Table */}
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.2}>
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Attendance Log</CardTitle>
            <Badge variant="secondary">{filtered.length} records</Badge>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">📋</div>
                <p className="text-sm text-muted-foreground">No attendance records found for this filter.</p>
                <p className="text-xs text-muted-foreground">Try adjusting your filters above.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => setSortDirection(s => s === "desc" ? "asc" : "desc")}>
                        <div className="flex items-center gap-1">
                          Date {sortDirection === "desc" ? "↓" : "↑"}
                        </div>
                      </TableHead>
                      <TableHead style={{ minWidth: "120px" }}>Clock In</TableHead>
                      <TableHead style={{ minWidth: "120px" }}>Clock Out</TableHead>
                      <TableHead>Worked (hrs)</TableHead>
                      <TableHead>Status</TableHead>
                      {!isEmployee && <TableHead className="w-[120px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(page * 20, (page + 1) * 20).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <p className="font-medium">{r.user?.firstName} {r.user?.lastName}</p>
                          <p className="text-xs text-muted-foreground">ID: {r.user?.employeeId || "—"} {r.user?.department ? `· ${r.user?.department}` : ""}</p>
                        </TableCell>
                        <TableCell className="font-medium">{r.date}</TableCell>
                        <TableCell className="font-medium" style={{ color: "#10b981" }}>
                          {r.clockInTime ? r.clockInTime.slice(11, 16) : "—"}
                        </TableCell>
                        <TableCell className="font-medium" style={{ color: "#ef4444" }}>
                          {r.clockOutTime ? r.clockOutTime.slice(11, 16) : "—"}
                        </TableCell>
                        <TableCell className="font-semibold">{r.hoursWorked != null ? r.hoursWorked : "—"}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        {!isEmployee && (
                          <TableCell>
                            <div className="flex gap-1">
                              <button title="Edit" onClick={() => startEdit(r)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Icon name="edit" size={14} /></button>
                              <button title="Delete" onClick={() => setDeleteConfirm(r.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"><Icon name="trash" size={14} /></button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Showing {Math.min((page + 1) * 20, filtered.length)} of {filtered.length} records
                  </p>
                  <div className="flex items-center gap-2">
                    {page > 0 && (
                      <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)}>
                        ← Previous 20
                      </Button>
                    )}
                    {(page + 1) * 20 < filtered.length && (
                      <Button size="sm" onClick={() => setPage((p) => p + 1)}>
                        Next 20 →
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Attendance Record"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)} disabled={!!actionLoading}>
              {actionLoading === deleteConfirm ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Are you sure you want to delete this attendance record? This action cannot be undone.</p>
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal
        open={!!editRecord}
        onClose={() => setEditRecord(null)}
        title="Edit Attendance Record"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditRecord(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </>
        }
      >
        {editRecord && (
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={editRecord.date} onChange={(e) => setEditRecord({ ...editRecord, date: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Clock In</label>
                <Input type="time" value={editRecord.clockIn} onChange={(e) => setEditRecord({ ...editRecord, clockIn: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Clock Out</label>
                <Input type="time" value={editRecord.clockOut} onChange={(e) => setEditRecord({ ...editRecord, clockOut: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
              <Select value={editRecord.status} onChange={(e) => setEditRecord({ ...editRecord, status: e.target.value })}>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ON_LEAVE">On Leave</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Note</label>
              <Input placeholder="Optional note..." value={editRecord.note} onChange={(e) => setEditRecord({ ...editRecord, note: e.target.value })} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttendancePage;
