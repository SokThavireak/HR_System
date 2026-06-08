import React, { useState, useEffect, useCallback, useMemo } from "react";
import { employeeService } from "../services/employeeService";
import AttendancePage from "./AttendancePage";
import ToastContainer from "../components/common/ToastContainer";
import { useToast } from "../hooks/useToast";
import {
  Button, Input, Select, Textarea,
  Card, CardHeader, CardTitle, CardContent,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  EmployeeDashboardSkeleton, PageTransition, Modal,
} from "../components/ui";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";

const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "home" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "leaves", label: "Leaves", icon: "calendar" },
  { key: "reports", label: "Reports", icon: "file" },
  { key: "profile", label: "Profile", icon: "user" },
];

const Icon = ({ name, size = 18 }) => {
  const s = size;
  const icons = {
    home: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    clock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    calendar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    file: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    user: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    dollar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    logout: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trending: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    download: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  };
  return icons[name] || null;
};

const StatusBadge = ({ status }) => {
  const map = {
    APPROVED: { bg: "#dcfce7", text: "#16a34a", label: "Approved" },
    PENDING: { bg: "#fef3c7", text: "#d97706", label: "Pending" },
    REJECTED: { bg: "#fee2e2", text: "#dc2626", label: "Rejected" },
  };
  const c = map[status] || { bg: "#f3f4f6", text: "#6b7280", label: status };
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
};

const EmployeeDashboard = ({ user }) => {
  const [section, setSection] = useState("dashboard");
  const [todayRecord, setTodayRecord] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [paySlips, setPaySlips] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  const loadData = useCallback(async () => {
    let done = false;
    const finish = () => {
      if (!done) { done = true; setLoading(false); }
    };
    // Safety timeout — stop loading after 8 seconds even if some requests hang
    const safetyTimer = setTimeout(finish, 8000);

    try {
      const results = await Promise.allSettled([
        employeeService.getToday().catch(() => null),
        employeeService.getDashboardSummary().catch(() => null),
        employeeService.getMyLeaves().catch(() => null),
        employeeService.getPaySlips().catch(() => null),
        employeeService.getPerformance().catch(() => null),
      ]);
      if (results[0].status === "fulfilled" && results[0].value) setTodayRecord(results[0].value.data);
      if (results[1].status === "fulfilled" && results[1].value) setSummary(results[1].value.data);
      if (results[2].status === "fulfilled" && results[2].value) setLeaves(results[2].value.data);
      if (results[3].status === "fulfilled" && results[3].value) setPaySlips(results[3].value.data);
      if (results[4].status === "fulfilled" && results[4].value) setPerformance(results[4].value.data);
    } catch (e) {
      console.error("[EmployeeDashboard] loadData error:", e);
    }
    clearTimeout(safetyTimer);
    finish();
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleClock = async () => {
    try {
      if (!todayRecord?.clockInTime) {
        const { data } = await employeeService.clockIn({});
        setTodayRecord(data);
        showToast("Clocked in successfully!");
      } else if (!todayRecord?.clockOutTime) {
        const { data } = await employeeService.clockOut({});
        setTodayRecord(data);
        showToast("Clocked out successfully!");
      }
    } catch (err) {
      showToast(err.message || "Action failed", "error");
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
      showToast("Leave request submitted!");
      form.reset();
      const { data } = await employeeService.getMyLeaves();
      setLeaves(data);
    } catch (err) {
      showToast(err.message || "Failed to submit", "error");
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await employeeService.updateProfile(profileForm);
      showToast("Profile updated!");
      setEditProfile(false);
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const openEditProfile = () => {
    setProfileForm({
      phone: user?.phone || "",
      department: user?.department || "",
      position: user?.position || "",
    });
    setEditProfile(true);
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isClockedIn = todayRecord?.clockInTime && !todayRecord?.clockOutTime;
  const isDoneToday = todayRecord?.clockInTime && todayRecord?.clockOutTime;

  const handleLogout = () => {
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_user");
    localStorage.removeItem("hrms_login_time");
    localStorage.removeItem("hrms_role");
    window.location.reload();
  };

  if (loading) return <EmployeeDashboardSkeleton />;

  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8f9fa" }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "#9a0002" }}>
            <Icon name="home" size={18} />
          </div>
          {sidebarOpen && <span className="text-lg font-bold tracking-tight">HRMS</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                } ${!sidebarOpen ? "justify-center px-0" : ""}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="shrink-0">{<Icon name={item.icon} size={18} />}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-gray-100 p-3">
          <div className={`flex items-center ${sidebarOpen ? "gap-3" : "justify-center"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer ${
              !sidebarOpen ? "justify-center px-0" : ""
            }`}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <Icon name="logout" size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className={`flex flex-1 flex-col overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 className="text-lg font-semibold capitalize">{section}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#9a0002" }}>
              {initials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <PageTransition variant="fadeUp" keyProp={section}>

            {/* ── DASHBOARD ── */}
            {section === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}</h2>
                  <p className="text-sm text-muted-foreground">Here&apos;s your overview for today.</p>
                </div>

                {/* Clock Card */}
                <StaggerItem>
                  <Card className="overflow-hidden" style={{ background: "linear-gradient(135deg, #9a0002, #7a0002)" }}>
                    <CardContent className="p-8 text-center text-white">
                      <p className="mb-1 text-sm font-medium text-white/70">Today's Attendance</p>
                      <p className="mb-6 text-5xl font-bold tracking-tight">{getCurrentTime()}</p>
                      <button
                        onClick={handleClock}
                        disabled={isDoneToday}
                        className="mx-auto flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-4 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                        style={{
                          borderColor: isClockedIn ? "#fca5a5" : isDoneToday ? "#86efac" : "rgba(255,255,255,0.4)",
                          background: isDoneToday ? "rgba(34,197,94,0.2)" : isClockedIn ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        {isDoneToday ? (
                          <Icon name="check" size={32} />
                        ) : (
                          <Icon name="clock" size={32} />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {isClockedIn ? "Clock Out" : isDoneToday ? "Done ✓" : "Clock In"}
                        </span>
                      </button>
                      <p className="mt-4 text-sm text-white/60">
                        {todayRecord?.clockInTime
                          ? `In: ${new Date(todayRecord.clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "Not clocked in yet"}
                        {todayRecord?.clockOutTime
                          ? ` · Out: ${new Date(todayRecord.clockOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : ""}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { bg: "#9a0002", value: summary?.presentDays ?? 0, label: "Present Days", icon: "check" },
                    { bg: "#3b82f6", value: `${summary?.overtimeHours ?? 0}h`, label: "Overtime", icon: "clock" },
                    { bg: "#f59e0b", value: summary?.pendingLeaves ?? 0, label: "Pending Leaves", icon: "calendar" },
                    { bg: "#22c55e", value: `$${summary?.lastPaySlip ?? 0}`, label: "Last Payslip", icon: "dollar" },
                  ].map((s) => (
                    <StaggerItem key={s.label}>
                      <Card>
                        <CardContent className="flex items-center gap-4 p-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: s.bg }}>
                            <Icon name={s.icon} size={20} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold leading-none">{s.value}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">{s.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StaggerItem>
                    <Card><CardContent className="p-5">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Attendance Rate</p>
                      <p className="text-3xl font-bold">{summary?.attendanceRate ?? 0}%</p>
                      <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${summary?.attendanceRate ?? 0}%`, background: (summary?.attendanceRate ?? 0) > 80 ? "#22c55e" : "#f59e0b" }} />
                      </div>
                    </CardContent></Card>
                  </StaggerItem>
                  <StaggerItem>
                    <Card><CardContent className="p-5">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Leave Balance</p>
                      <p className="text-3xl font-bold">{leaves.length} <span className="text-sm font-normal text-muted-foreground">requests</span></p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{leaves.filter(l => l.status === "APPROVED").length} approved</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{leaves.filter(l => l.status === "PENDING").length} pending</span>
                      </div>
                    </CardContent></Card>
                  </StaggerItem>
                  <StaggerItem>
                    <Card><CardContent className="p-5">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Performance Score</p>
                      <p className="text-3xl font-bold">{performance.length > 0 ? performance[0]?.overallScore?.toFixed(1) : "—"} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></p>
                      <div className="mt-3 flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="h-2 flex-1 rounded-full" style={{ background: s <= Math.round(performance[0]?.overallScore || 0) ? "#9a0002" : "#e5e7eb" }} />
                        ))}
                      </div>
                    </CardContent></Card>
                  </StaggerItem>
                </div>

                {/* Recent leaves */}
                <StaggerItem>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base">Recent Leave Requests</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSection("leaves")}>View All</Button>
                    </CardHeader>
                    <CardContent>
                      {leaves.length === 0 ? (
                        <p className="py-4 text-sm text-muted-foreground">No leave requests yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {leaves.slice(0, 4).map((lv) => (
                            <div key={lv.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{lv.leaveType}</span>
                                  <StatusBadge status={lv.status} />
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{lv.startDate} → {lv.endDate} ({lv.totalDays} days)</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </StaggerItem>
              </div>
            )}

            {/* ── ATTENDANCE ── */}
            {section === "attendance" && (
              <AttendancePage showSidebar={false} />
            )}

            {/* ── LEAVES ── */}
            {section === "leaves" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Leave Management</h2>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Request Time Off</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleLeaveSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Leave Type</label>
                          <Select name="leaveType" required>
                            <option value="IL">Annual Leave</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="IL">Emergency</option>
                            <option value="SPECIAL">Maternity</option>
                            <option value="SPECIAL">Paternity</option>
                            <option value="UNPAID">Unpaid Leave</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
                          <Input type="date" name="startDate" required />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
                          <Input type="date" name="endDate" required />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Reason</label>
                        <Textarea name="reason" rows="3" required placeholder="Please describe your reason..." />
                      </div>
                      <Button type="submit">Submit Request</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">My Leave History</CardTitle></CardHeader>
                  <CardContent>
                    {leaves.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">No leave requests found.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead>
                            <TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead>Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaves.map((lv) => (
                            <TableRow key={lv.id}>
                              <TableCell className="font-medium">{lv.leaveType}</TableCell>
                              <TableCell>{lv.startDate}</TableCell>
                              <TableCell>{lv.endDate}</TableCell>
                              <TableCell>{lv.totalDays}</TableCell>
                              <TableCell><StatusBadge status={lv.status} /></TableCell>
                              <TableCell className="max-w-[200px] truncate text-muted-foreground">{lv.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── REPORTS ── */}
            {section === "reports" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Reports & Payslips</h2>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">My Payslips</CardTitle></CardHeader>
                  <CardContent>
                    {paySlips.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">No payslips available.</p>
                    ) : (
                      <div className="space-y-3">
                        {paySlips.map((ps) => (
                          <div key={ps.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                              <p className="text-sm font-medium">{ps.payPeriodStart} — {ps.payPeriodEnd}</p>
                              <p className="text-xs text-muted-foreground">
                                Net: <strong className="text-emerald-600">${ps.netSalary}</strong> · Gross: ${ps.grossSalary}
                              </p>
                            </div>
                            <StatusBadge status={ps.status === "PAID" ? "APPROVED" : ps.status === "PROCESSED" ? "PENDING" : "PENDING"} />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Performance Reviews</CardTitle></CardHeader>
                  <CardContent>
                    {performance.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">No reviews yet.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Period</TableHead><TableHead>Quality</TableHead>
                            <TableHead>Productivity</TableHead><TableHead>Overall</TableHead><TableHead>Feedback</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {performance.map((pr) => (
                            <TableRow key={pr.id}>
                              <TableCell>{pr.reviewPeriodStart} — {pr.reviewPeriodEnd}</TableCell>
                              <TableCell>{pr.qualityScore}/5</TableCell>
                              <TableCell>{pr.productivityScore}/5</TableCell>
                              <TableCell className="font-bold text-primary">{pr.overallScore}/5</TableCell>
                              <TableCell className="max-w-[200px] truncate text-muted-foreground">{pr.feedback}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── PROFILE ── */}
            {section === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <Card className="max-w-2xl">
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: "#9a0002" }}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        {user?.employeeId && <p className="text-xs text-muted-foreground mt-0.5">ID: {user.employeeId}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">First Name</label>
                        <Input defaultValue={user?.firstName} readOnly />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Last Name</label>
                        <Input defaultValue={user?.lastName} readOnly />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                        <Input defaultValue={user?.email} type="email" readOnly />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
                        <Input defaultValue={user?.phone || ""} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                        <Input defaultValue={user?.department || "—"} readOnly />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Position</label>
                        <Input defaultValue={user?.position || "—"} readOnly />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
                        <Input defaultValue={user?.employeeId || "—"} readOnly />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={openEditProfile}>Edit Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </PageTransition>
        </div>
      </main>

      {/* ─── EDIT PROFILE MODAL ─── */}
      <Modal
        open={editProfile}
        onClose={() => setEditProfile(false)}
        title="Edit Profile"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditProfile(false)}>Cancel</Button>
            <Button onClick={handleProfileSave} disabled={profileLoading}>
              {profileLoading ? "Saving…" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
            <Input value={profileForm.phone || ""} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
            <Input value={profileForm.department || ""} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Position</label>
            <Input value={profileForm.position || ""} onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
