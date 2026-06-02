import React, { useState, useEffect, useCallback } from "react";
import { employeeService } from "../services/employeeService";
import AttendancePage from "./AttendancePage";
import ToastContainer from "../components/common/ToastContainer";
import { useToast } from "../hooks/useToast";
import { ShaderAnimation } from "../components/ui/shader-animation";
import {
  Button, Input, Select, Textarea,
  Card, CardHeader, CardTitle, CardContent,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  LoadingSkeleton, LoadingSpinner, LoadingScreen, PageTransition,
} from "../components/ui";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";

const TABS = [
  { key: "dashboard", label: "Home", icon: "home" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "leaves", label: "Leaves", icon: "calendar" },
  { key: "reports", label: "Reports", icon: "file" },
  { key: "profile", label: "Profile", icon: "user" },
];

const TabIcon = ({ name, size = 20, strokeWidth = 2 }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    file: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[name] || icons.home;
};

const EmployeeDashboard = ({ user }) => {
  const [tab, setTab] = useState("dashboard");
  const [todayRecord, setTodayRecord] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [paySlips, setPaySlips] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toasts, showToast, removeToast } = useToast();

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavVisible(y <= 60 || y < lastScrollY);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const loadData = useCallback(async () => {
    try {
      const [todayRes, summaryRes, leavesRes, slipsRes, perfRes] =
        await Promise.allSettled([
          employeeService.getToday(),
          employeeService.getDashboardSummary(),
          employeeService.getMyLeaves(),
          employeeService.getPaySlips(),
          employeeService.getPerformance(),
        ]);
      if (todayRes.status === "fulfilled") setTodayRecord(todayRes.value.data);
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
      if (leavesRes.status === "fulfilled") setLeaves(leavesRes.value.data);
      if (slipsRes.status === "fulfilled") setPaySlips(slipsRes.value.data);
      if (perfRes.status === "fulfilled") setPerformance(perfRes.value.data);
    } catch (err) {
      showToast("Failed to load data", "error");
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
        showToast("Clocked in successfully!");
      } catch (err) { showToast(err.message || "Clock in failed", "error"); }
    } else if (todayRecord.clockInTime && !todayRecord.clockOutTime) {
      try {
        const { data } = await employeeService.clockOut({});
        setTodayRecord(data);
        showToast("Clocked out successfully!");
      } catch (err) { showToast(err.message || "Clock out failed", "error"); }
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
    } catch (err) { showToast(err.message || "Failed to submit", "error"); }
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isClockedIn = todayRecord?.clockInTime && !todayRecord?.clockOutTime;
  const isDoneToday = todayRecord?.clockInTime && todayRecord?.clockOutTime;

  if (loading) return <LoadingScreen variant="employee" />;

  return (
    <div className="min-h-screen" style={{ background: "#efe6dd" }}>

      {/* ═══ SHADER BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ShaderAnimation theme="light" />
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-50 flex h-32 items-center justify-between px-8 border-b border-gray-200/50 backdrop-blur-md bg-transparent transition-transform duration-300 ease-in-out" style={{ background: "transparent", transform: navVisible ? "translateY(0)" : "translateY(-100%)" }}>
        <div className="flex items-center gap-4 animate-header-title">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 animate-header-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-foreground">HRMS</span>
            <p className="text-xs font-medium text-muted-foreground">Employee Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4 animate-header-right">
          <div className="flex items-center gap-2.5 rounded-full px-4 py-2 max-w-[220px] animate-header-time" style={{ background: "rgba(154, 0, 2, 0.08)" }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "#9a0002" }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <button
            onClick={() => { localStorage.removeItem("hrms_token"); window.location.reload(); }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      <div className="p-6 pb-24 min-h-[calc(100vh-8rem)]" style={{ background: "transparent" }}>
        <PageTransition variant="fadeUp" keyProp={tab}>
        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <ScrollReveal variant="fadeUp" stagger={0.08} delay={0.05}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
              <p className="text-sm text-muted-foreground">Here's your dashboard overview.</p>
            </div>

            {/* Clock Card */}
            <StaggerItem>
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary-dark text-primary-foreground animate-bounce-in">
                <CardContent className="p-8 text-center">
                  <p className="mb-2 text-sm font-medium text-white/70">Today's Attendance</p>
                  <p className="mb-6 text-5xl font-bold tracking-tight">{getCurrentTime()}</p>
                  <button
                    onClick={handleClock}
                    disabled={isDoneToday}
                    className="mx-auto flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full border-4 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    style={{
                      borderColor: isClockedIn ? "#fca5a5" : isDoneToday ? "#86efac" : "rgba(255,255,255,0.4)",
                      background: isDoneToday ? "rgba(34,197,94,0.2)" : isClockedIn ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {isDoneToday ? (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isClockedIn ? "Clock Out" : isDoneToday ? "Done ✓" : "Clock In"}
                    </span>
                  </button>
                  <p className="mt-4 text-sm text-white/60">
                    {todayRecord?.clockInTime
                      ? `Clocked in at ${new Date(todayRecord.clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Not clocked in yet"}
                    {todayRecord?.clockOutTime
                      ? ` · Clocked out at ${new Date(todayRecord.clockOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : ""}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { bg: "#9a0002", value: summary?.presentDays || 0, label: "Present Days", icon: "check" },
                { bg: "#3b82f6", value: `${summary?.overtimeHours || 0}h`, label: "Overtime", icon: "clock" },
                { bg: "#f59e0b", value: summary?.pendingLeaves || 0, label: "Pending Leaves", icon: "calendar" },
                { bg: "#22c55e", value: `$${summary?.lastPaySlip || 0}`, label: "Last Payslip", icon: "dollar" },
              ].map((s) => (
                <StaggerItem key={s.label}>
                  <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: s.bg }}>
                      {s.icon === "check" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      {s.icon === "clock" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                      {s.icon === "calendar" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                      {s.icon === "dollar" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
                    </div>
                    <div>
                      <p className="text-xl font-bold leading-none">{s.value}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>

            {/* Attendance Rate + Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StaggerItem>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Attendance Rate</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">{summary?.attendanceRate || 0}%</span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${summary?.attendanceRate || 0}%`, background: (summary?.attendanceRate || 0) > 80 ? "#22c55e" : "#f59e0b" }} />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Total Leaves</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">{leaves.length}</span>
                      <span className="text-xs text-muted-foreground mb-1">requests</span>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{leaves.filter(l => l.status === 'APPROVED').length} approved</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{leaves.filter(l => l.status === 'PENDING').length} pending</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Performance</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">{performance.length > 0 ? performance[0]?.overallScore?.toFixed(1) : '—'}</span>
                      <span className="text-xs text-muted-foreground mb-1">/ 5.0</span>
                    </div>
                    <div className="mt-3 flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <div key={s} className="h-2 flex-1 rounded-full" style={{ background: s <= Math.round(performance[0]?.overallScore || 0) ? "#9a0002" : "#e5e7eb" }} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </div>

            {/* Recent Leaves */}
            <StaggerItem>
              <Card>
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Leave Requests</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTab("leaves")}>View All</Button>
              </CardHeader>
              {leaves.length === 0 ? (
                <CardContent><p className="py-2 text-sm text-muted-foreground">No leave requests yet.</p></CardContent>
              ) : (
                <div className="relative space-y-1 px-6 pb-6 pl-10">
                  <div className="absolute left-[29px] top-2 bottom-2 w-px bg-border" />
                  {leaves.slice(0, 3).map((lv) => (
                    <div key={lv.id} className="relative py-1.5">
                      <div
                        className="absolute -left-[17px] top-2.5 h-2.5 w-2.5 rounded-full border-2"
                        style={{
                          borderColor: lv.status === "APPROVED" ? "#22c55e" : lv.status === "REJECTED" ? "#ef4444" : "#f59e0b",
                          background: lv.status === "APPROVED" ? "#22c55e" : lv.status === "REJECTED" ? "#ef4444" : "#f59e0b",
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{lv.leaveType}</span>
                        <span className="text-xs text-muted-foreground">— {lv.startDate} to {lv.endDate}</span>
                        <Badge variant={lv.status === "APPROVED" ? "success" : lv.status === "REJECTED" ? "destructive" : "warning"}>{lv.status}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{lv.reason}</p>
                    </div>
                  ))}
                </div>
              )}
              </Card>
            </StaggerItem>
          </div>
          </ScrollReveal>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {tab === "attendance" && <AttendancePage showSidebar={false} />}

        {/* ── LEAVES TAB ── */}
        {tab === "leaves" && (
          <ScrollReveal variant="fadeUp" stagger={0.08} delay={0.05}>
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
                        <option value="ANNUAL">Annual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="EMERGENCY">Emergency</option>
                        <option value="MATERNITY">Maternity</option>
                        <option value="PATERNITY">Paternity</option>
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
                {!leaves.length ? (
                  <p className="py-4 text-sm text-muted-foreground">No leave requests found.</p>
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
                          <TableCell>{lv.startDate}</TableCell><TableCell>{lv.endDate}</TableCell>
                          <TableCell>{lv.totalDays}</TableCell>
                          <TableCell><Badge variant={lv.status === "APPROVED" ? "success" : lv.status === "REJECTED" ? "destructive" : "warning"}>{lv.status}</Badge></TableCell>
                          <TableCell className="max-w-[200px] truncate text-muted-foreground">{lv.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
          </ScrollReveal>
        )}

        {/* ── REPORTS TAB ── */}
        {tab === "reports" && (
          <ScrollReveal variant="fadeUp" stagger={0.08} delay={0.05}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & PaySlips</h2>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">My Payslips</CardTitle></CardHeader>
              <CardContent>
                {paySlips.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">No payslips available.</p>
                ) : (
                  <div className="space-y-3">
                    {paySlips.map((ps) => (
                      <div key={ps.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="text-sm font-medium">Period: {ps.payPeriodStart} — {ps.payPeriodEnd}</p>
                          <p className="text-xs text-muted-foreground">
                            Net Pay: <strong className="text-emerald-600">${ps.netSalary}</strong> | Gross: ${ps.grossSalary}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download
                        </Button>
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
                  <p className="py-4 text-sm text-muted-foreground">No reviews yet.</p>
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
          </ScrollReveal>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <ScrollReveal variant="fadeUp" stagger={0.08} delay={0.05}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div><label className="mb-1 block text-xs font-medium text-muted-foreground">First Name</label><Input defaultValue={user?.firstName} readOnly /></div>
                    <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Last Name</label><Input defaultValue={user?.lastName} readOnly /></div>
                  </div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label><Input defaultValue={user?.email} type="email" readOnly /></div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label><Input defaultValue={user?.department || "N/A"} readOnly /></div>
                    <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Position</label><Input defaultValue={user?.position || "N/A"} readOnly /></div>
                  </div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label><Input defaultValue={user?.phone || "+1 000-000-0000"} /></div>
                  <Button onClick={() => showToast("Profile updated!", "success")}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          </ScrollReveal>
        )}
        </PageTransition>
      </div>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-card px-2 py-2 shadow-lg sm:hidden animate-bottom-nav">
        {/* Animated glow background */}
        <div className="bottom-nav-glow-bg" />
        {/* Shimmer sweep */}
        <div className="bottom-nav-shimmer" />
        {/* Top glow line */}
        <div className="bottom-nav-glow-line" />

        {TABS.map((item, idx) => {
          const isActive = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`animate-nav-item-fade relative z-10 flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute -top-2 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_2px_hsla(var(--primary),0.4)] animate-bottom-nav-indicator" />
              )}
              <span className={isActive ? "animate-bottom-nav-item" : ""}>
                <TabIcon name={item.icon} size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </span>
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default EmployeeDashboard;
