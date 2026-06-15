import React, { useState, useEffect, useCallback, useRef } from "react";
import { employeeService } from "../services/employeeService";
import AttendancePage from "./AttendancePage";
import ToastContainer from "../components/common/ToastContainer";
import { useToast } from "../hooks/useToast";
import { ShaderAnimation } from "../components/ui/shader-animation";
import {
  Button, Input, Select, Textarea,
  Card, CardHeader, CardTitle, CardContent,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  EmployeeDashboardSkeleton, PageTransition, Modal,
} from "../components/ui";
import { CheckCircle2, AlertCircle, X, Search, Filter } from "lucide-react";
import { authService } from "../services/authService";
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
    chart: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    refresh: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    phone: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
    menu: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    x: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
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

/* ═══════════════════════════════════════════
   EMPLOYEE DASHBOARD
   Layout matches AdminDashboard exactly:
   fixed sidebar + transparent main + shader bg
   ═══════════════════════════════════════════ */
const EmployeeDashboard = ({ user }) => {
  const userRoles = (user?.roles || []).map((r) => (typeof r === "object" ? r.name : r));
  if (!userRoles.includes("ROLE_EMPLOYEE")) {
    localStorage.clear();
    window.location.reload();
    return null;
  }

  const [section, setSection] = useState("dashboard");
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNavY, setActiveNavY] = useState(0);
  const [activeNavH, setActiveNavH] = useState(44);
  const navItemRefs = useRef([]);
  const navRef = useRef(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [paySlips, setPaySlips] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateActiveNavY = useCallback(() => {
    const idx = SIDEBAR_ITEMS.findIndex((s) => s.key === section);
    const el = navItemRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      setActiveNavY(el.offsetTop);
      setActiveNavH(el.offsetHeight);
    }
  }, [section]);

  useEffect(() => {
    const t1 = setTimeout(updateActiveNavY, 50);
    const t2 = setTimeout(updateActiveNavY, 500); // after initial animations
    window.addEventListener("resize", updateActiveNavY);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", updateActiveNavY);
    };
  }, [updateActiveNavY]);

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
    let done = false;
    const finish = () => { if (!done) { done = true; setLoading(false); } };
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
      if (results[2].status === "fulfilled" && results[2].value) {
        const lvData = results[2].value.data;
        setLeaves(lvData.content ? lvData.content : lvData);
      }
      if (results[3].status === "fulfilled" && results[3].value) {
        const psData = results[3].value.data;
        setPaySlips(psData.content ? psData.content : psData);
      }
      if (results[4].status === "fulfilled" && results[4].value) {
        const perfData = results[4].value.data;
        setPerformance(perfData.content ? perfData.content : perfData);
      }
    } catch (e) { console.error("[EmployeeDashboard] loadData error:", e); }
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
        employeeService.getDashboardSummary().then(res => setSummary(res.data)).catch(() => {});
      } else if (!todayRecord?.clockOutTime) {
        const { data } = await employeeService.clockOut({});
        setTodayRecord(data);
        showToast("Clocked out successfully!");
        employeeService.getDashboardSummary().then(res => setSummary(res.data)).catch(() => {});
      }
    } catch (err) { showToast(err.message || "Action failed", "error"); }
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

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await employeeService.updateProfile(profileForm);
      showToast("Profile updated!");
      setEditProfile(false);
    } catch (err) { showToast(err.message || "Failed to save", "error"); }
    finally { setProfileLoading(false); }
  };

  const openEditProfile = () => {
    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      department: user?.department || "",
      position: user?.position || "",
    });
    setEditProfile(true);
  };

  const isClockedIn = todayRecord?.clockInTime && !todayRecord?.clockOutTime;
  const isDoneToday = todayRecord?.clockInTime && todayRecord?.clockOutTime;
  const handleLogout = () => { localStorage.removeItem("hrms_token"); localStorage.removeItem("hrms_user"); localStorage.removeItem("hrms_login_time"); localStorage.removeItem("hrms_role"); window.location.reload(); };

  const [leaveTypeFilter, setLeaveTypeFilter] = useState("ALL");
  const [activeUser, setActiveUser] = useState(user);

  useEffect(() => {
    if (activeUser && activeUser.baseSalary === undefined) {
      authService.getCurrentUser()
        .then(res => {
          if (res.data) setActiveUser(res.data);
        })
        .catch(console.error);
    }
  }, [activeUser]);

  const initials = activeUser?.firstName && activeUser?.lastName
    ? `${activeUser.firstName.charAt(0)}${activeUser.lastName.charAt(0)}`
    : "??";

  if (loading) return <EmployeeDashboardSkeleton />;

  return (
    <div className="min-h-screen" style={{ background: "#efe6dd" }}>

      {/* ═══ SHADER BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ShaderAnimation theme="light" />
      </div>

      {/* ══════════════════════════════════════════
          SIDEBAR — Cherry Cola #9a0002
          ══════════════════════════════════════════ */}
      <aside className={`flex flex-col dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`} style={{ background: "#9a0002" }}>
        <div className="flex h-full flex-col relative">
          {/* Close button on mobile */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            title="Close sidebar"
          >
            <Icon name="x" size={16} />
          </button>
          {/* Logo */}
          <div className="px-3 pb-8 pt-8 animate-nav-item-fade" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 rounded-xl px-3 py-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Icon name="chart" size={24} />
              </div>
              <div className="min-w-0">
                <span className="text-2xl font-black leading-none tracking-tight text-white">HRMS</span>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">Employee Portal</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav ref={navRef} className="relative flex flex-1 flex-col px-3">
            <div
              className="absolute left-3 right-3 rounded-xl pointer-events-none overflow-hidden"
              style={{
                height: activeNavH, top: activeNavY,
                background: "rgba(255,255,255,0.18)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)",
                transition: "top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease",
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 0 12px 2px rgba(255,255,255,0.4)" }} />
            </div>
            {SIDEBAR_ITEMS.map((item, idx) => {
              const isActive = section === item.key;
              return (
                <button
                  key={item.key}
                  ref={el => { navItemRefs.current[idx] = el; }}
                  onClick={() => { updateActiveNavY(); setSection(item.key); setSidebarOpen(false); }}
                  className={`animate-sidebar-item relative z-10 flex w-full items-center gap-3 rounded-xl px-3 text-sm font-medium cursor-pointer transition-all duration-300 ${isActive ? "text-white font-bold" : "text-white/60 hover:text-white"}`}
                  style={{ paddingTop: "10px", paddingBottom: "10px", minHeight: "44px", animationDelay: `${0.15 + idx * 0.06}s` }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 scale-110" : ""}`}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "rgba(255,255,255,0.2)" }}>{initials}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-[10px] text-white/50">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white cursor-pointer" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon name="logout" size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          MAIN — transparent, shows body #efe6dd
          ══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-1 flex-col dashboard-main" style={{ background: "transparent" }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-50 flex min-h-24 h-auto py-4 flex-wrap gap-4 shrink-0 items-center justify-between px-6 lg:px-8 border-b border-gray-200/50 backdrop-blur-md transition-transform duration-300 ease-in-out" style={{ background: "transparent", transform: navVisible ? "translateY(0)" : "translateY(-100%)" }}>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Hamburger menu button on mobile/tablet */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 rounded-lg bg-gray-200/50 hover:bg-gray-200 text-foreground cursor-pointer shrink-0"
              title="Open sidebar"
            >
              <Icon name="menu" size={20} />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(154, 0, 2, 0.1)" }}>
              <Icon name={SIDEBAR_ITEMS.find((s) => s.key === section)?.icon || "home"} size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground animate-header-title">
                {SIDEBAR_ITEMS.find((s) => s.key === section)?.label || "Dashboard"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-none">Employee Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 animate-header-right">
            <time className="text-sm text-muted-foreground animate-header-time">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </time>
            <button onClick={() => window.location.reload()} className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-muted-foreground hover:bg-gray-200 hover:text-foreground transition-colors cursor-pointer" title="Refresh page">
              <Icon name="refresh" size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative flex flex-col flex-1 p-8" style={{ background: "transparent" }}>
          <PageTransition variant="fadeUp" keyProp={section}>

            {/* ═══ DASHBOARD TAB ═══ */}
            {section === "dashboard" && (
              <div className="space-y-7">
                <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: "#3d2b1f" }}>Welcome back, {user?.firstName}</h2>
                    <p className="text-sm" style={{ color: "#8b7355" }}>Here&apos;s your overview for today.</p>
                  </div>
                </ScrollReveal>

                {/* Clock Card */}
                <StaggerItem>
                  <Card 
                    className="overflow-hidden border-0 shadow-lg flex flex-col items-center justify-center min-h-[320px]" 
                    style={{ background: "linear-gradient(135deg, #9a0002 0%, #6b0001 100%)" }}
                  >
                    <CardContent className="w-full p-6 flex flex-col items-center justify-center text-center text-white">
                      <p className="mb-2 text-sm font-medium text-white/70">Today&apos;s Attendance</p>
                      <p className="mb-8 text-5xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{currentTime}</p>
                      
                      <button 
                        onClick={handleClock} 
                        disabled={isDoneToday} 
                        className="mx-auto flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-4 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer" 
                        style={{ 
                          borderColor: isClockedIn ? "#fca5a5" : isDoneToday ? "#86efac" : "rgba(255,255,255,0.4)", 
                          background: isDoneToday ? "rgba(34,197,94,0.2)" : isClockedIn ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)" 
                        }}
                      >
                        {isDoneToday ? <Icon name="check" size={32} /> : <Icon name="clock" size={32} />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {isClockedIn ? "Clock Out" : isDoneToday ? "Done ✓" : "Clock In"}
                        </span>
                      </button>
                      
                      <p className="mt-6 text-sm text-white/60">
                        {todayRecord?.clockInTime ? `In: ${new Date(todayRecord.clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not clocked in yet"}
                        {todayRecord?.clockOutTime ? ` · Out: ${new Date(todayRecord.clockOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                  {[
                    { bg: "#10b981", v: summary?.presentDays ?? 0, k: "Present", icon: "check" },
                    { bg: "#f59e0b", v: summary?.lateDays ?? 0, k: "Late", icon: "clock" },
                    { bg: "#ef4444", v: summary?.absentDays ?? 0, k: "Absent", icon: "x" },
                    { bg: "#9a0002", v: `${Number(summary?.totalHours ?? 0).toFixed(1)}h`, k: "Total Hours", icon: "timer" },
                    { bg: "#6366f1", v: summary?.attendanceRate ?? "-", k: "Rating (/5)", icon: "check" },
                    { bg: "#b45309", v: `${Number(summary?.overtimeHours ?? 0).toFixed(1)}h`, k: "Overtime", icon: "clock" },
                    { bg: "#3b82f6", v: summary?.leaveBalance?.ilRemaining ?? 0, k: "IL Left", icon: "calendar" },
                    { bg: "#f59e0b", v: summary?.leaveBalance?.sickRemaining ?? 0, k: "Sick Left", icon: "calendar" },
                    { bg: "#8b5cf6", v: summary?.leaveBalance?.specialRemaining ?? 0, k: "Special Left", icon: "calendar" },
                    { bg: "#15803d", v: `$${summary?.lastPaySlip ?? 0}`, k: "Last Payslip", icon: "dollar" },
                  ].map((s) => (
                    <StaggerItem key={s.k}>
                      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5" style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: s.bg }}>
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

                {/* Secondary stats */}
<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
  
  {/* Card 1: Attendance */}
  <StaggerItem className="h-full">
    <Card className="border-0 shadow-md h-full flex flex-col" style={{ background: "#fffbf7" }}>
      {/* Added pt-6 to override default CardContent behavior, and justify-center */}
      <CardContent className="px-6 pb-6 pt-6 flex flex-col justify-center h-full flex-1">
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b7355" }}>Attendance Rate</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold" style={{ color: "#3d2b1f" }}>{summary?.attendanceRate ?? 0}%</span>
          </div>
        </div>
        {/* Increased margin-top to mt-6 for clear separation */}
        <div className="mt-6 h-2.5 w-full rounded-full overflow-hidden" style={{ background: "#ede0d4" }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${summary?.attendanceRate ?? 0}%`, background: (summary?.attendanceRate ?? 0) > 80 ? "#15803d" : "#c2410c" }} />
        </div>
      </CardContent>
    </Card>
  </StaggerItem>

  {/* Card 2: Leave Requests */}
  <StaggerItem className="h-full">
    <Card className="border-0 shadow-md h-full flex flex-col" style={{ background: "#fffbf7" }}>
      <CardContent className="px-6 pb-6 pt-6 flex flex-col justify-center h-full flex-1">
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b7355" }}>My Leave Requests</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold" style={{ color: "#3d2b1f" }}>{leaves.length}</span>
            <span className="text-sm font-normal" style={{ color: "#8b7355" }}>total</span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "#dcfce7", color: "#15803d" }}>
            {leaves.filter(l => l.status === "APPROVED").length} approved
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "#fef3c7", color: "#b45309" }}>
            {leaves.filter(l => l.status === "PENDING").length} pending
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            {leaves.filter(l => l.status === "REJECTED").length} rejected
          </span>
        </div>
      </CardContent>
    </Card>
  </StaggerItem>

  {/* Card 3: Performance Score */}
  <StaggerItem className="h-full">
    <Card className="border-0 shadow-md h-full flex flex-col" style={{ background: "#fffbf7" }}>
      <CardContent className="px-6 pb-6 pt-6 flex flex-col justify-center h-full flex-1">
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b7355" }}>Performance Score</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold" style={{ color: "#3d2b1f" }}>
              {performance.length > 0 ? performance[0]?.overallScore?.toFixed(1) : "—"}
            </span>
            <span className="text-sm font-normal" style={{ color: "#8b7355" }}>/ 5.0</span>
          </div>
        </div>
        <div className="mt-6 flex gap-1 w-full">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="h-2.5 flex-1 rounded-full" style={{ background: s <= Math.round(performance[0]?.overallScore || 0) ? "#9a0002" : "#ede0d4" }} />
          ))}
        </div>
      </CardContent>
    </Card>
  </StaggerItem>

</div>

                {/* Recent leaves */}
                <StaggerItem>
                  <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>Recent Leave Requests</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSection("leaves")} style={{ color: "#9a0002" }}>View All</Button>
                    </CardHeader>
                    <CardContent>
                      {leaves.length === 0 ? (
                        <p className="py-4 text-sm" style={{ color: "#8b7355" }}>No leave requests yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {leaves.slice(0, 4).map((lv) => (
                            <div key={lv.id} className="flex items-center justify-between rounded-lg px-4 py-4" style={{ background: "#f5efe8", border: "1px solid #e8ddd0" }}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold" style={{ color: "#3d2b1f" }}>{lv.leaveType}</span>
                                  <StatusBadge status={lv.status} />
                                </div>
                                <p className="mt-0.5 text-xs" style={{ color: "#8b7355" }}>{lv.startDate} → {lv.endDate} ({lv.totalDays} days)</p>
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

            {/* ═══ ATTENDANCE TAB ═══ */}
            {section === "attendance" && (
              <AttendancePage showSidebar={false} user={user} />
            )}

            {/* ═══ LEAVES TAB ═══ */}
            {section === "leaves" && (
              <div className="space-y-7">
                <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
                  <h2 className="text-2xl font-bold" style={{ color: "#3d2b1f" }}>Leave Management</h2>
                </ScrollReveal>
                <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                  <CardHeader className="pb-3"><CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>Request Time Off</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleLeaveSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Leave Type</label>
                          <Select name="leaveType" required>
                            <option value="IL">Annual Leave</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="SPECIAL">Maternity</option>
                            <option value="UNPAID">Unpaid Leave</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Start Date</label>
                          <Input type="date" name="startDate" required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>End Date</label>
                          <Input type="date" name="endDate" required />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Reason</label>
                        <Textarea name="reason" rows="3" required placeholder="Please describe your reason..." />
                      </div>
                      <Button type="submit" style={{ background: "#9a0002" }}>Submit Request</Button>
                    </form>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                  <CardHeader className="pb-4"><CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>My Leave History</CardTitle></CardHeader>
                  <CardContent>
                    {leaves.length === 0 ? (
                      <p className="py-8 text-center" style={{ color: "#8b7355" }}>No leave requests found.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #e8ddd0" }}>
                        <Table className="min-w-[600px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ color: "#8b7355" }}>Type</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>From</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>To</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Days</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Status</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Reason</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leaves.map((lv) => (
                              <TableRow key={lv.id}>
                                <TableCell className="font-semibold" style={{ color: "#3d2b1f" }}>{lv.leaveType}</TableCell>
                                <TableCell style={{ color: "#5c4033" }}>{lv.startDate}</TableCell>
                                <TableCell style={{ color: "#5c4033" }}>{lv.endDate}</TableCell>
                                <TableCell style={{ color: "#5c4033" }}>{lv.totalDays}</TableCell>
                                <TableCell><StatusBadge status={lv.status} /></TableCell>
                                <TableCell className="max-w-[200px] truncate" style={{ color: "#8b7355" }}>{lv.reason}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ═══ REPORTS TAB ═══ */}
            {section === "reports" && (
              <div className="space-y-7">
                <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
                  <h2 className="text-2xl font-bold" style={{ color: "#3d2b1f" }}>Reports &amp; Payslips</h2>
                </ScrollReveal>
                <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                  <CardHeader className="pb-3"><CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>My Payslips</CardTitle></CardHeader>
                  <CardContent>
                    {paySlips.length === 0 ? (
                      <p className="py-8 text-center" style={{ color: "#8b7355" }}>No payslips available.</p>
                    ) : (
                      <div className="space-y-3">
                        {paySlips.map((ps) => (
                          <div key={ps.id} className="flex items-center justify-between rounded-xl px-5 py-5" style={{ background: "#f5efe8", border: "1px solid #e8ddd0" }}>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "#3d2b1f" }}>{ps.payPeriodStart} — {ps.payPeriodEnd}</p>
                              <p className="text-xs mt-0.5" style={{ color: "#8b7355" }}>Net: <strong style={{ color: "#15803d" }}>${ps.netSalary}</strong> · Gross: ${ps.grossSalary}</p>
                            </div>
                            <StatusBadge status={ps.status === "PAID" ? "APPROVED" : "PENDING"} />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                  <CardHeader className="pb-3"><CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>Performance Reviews</CardTitle></CardHeader>
                  <CardContent>
                    {performance.length === 0 ? (
                      <p className="py-8 text-center" style={{ color: "#8b7355" }}>No reviews yet.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #e8ddd0" }}>
                        <Table className="min-w-[600px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ color: "#8b7355" }}>Period</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Quality</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Productivity</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Overall</TableHead>
                              <TableHead style={{ color: "#8b7355" }}>Feedback</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {performance.map((pr) => (
                              <TableRow key={pr.id}>
                                <TableCell style={{ color: "#5c4033" }}>{pr.reviewPeriodStart} — {pr.reviewPeriodEnd}</TableCell>
                                <TableCell style={{ color: "#5c4033" }}>{pr.qualityScore}/5</TableCell>
                                <TableCell style={{ color: "#5c4033" }}>{pr.productivityScore}/5</TableCell>
                                <TableCell className="font-bold" style={{ color: "#9a0002" }}>{pr.overallScore}/5</TableCell>
                                <TableCell className="max-w-[200px] truncate" style={{ color: "#8b7355" }}>{pr.feedback}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* ═══ PROFILE TAB ═══ */}
            {section === "profile" && (
              <div className="space-y-6 animate-fade-up">
                <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
                  <h2 className="text-2xl font-bold" style={{ color: "#3d2b1f" }}>My Profile</h2>
                </ScrollReveal>

                {/* Profile Header Card */}
                <StaggerItem>
                  <Card className="border-0 shadow-md overflow-hidden" style={{ background: "#fffbf7" }}>
                    <div className="h-2" style={{ background: "linear-gradient(90deg, #9a0002, #6b0001)" }} />
                    <CardContent className="px-8 py-10 relative">
                      <div className="flex flex-col items-center text-center gap-5">
                        
                        <div>
                          <h3 className="text-3xl font-bold" style={{ color: "#3d2b1f" }}>
                            {activeUser?.firstName} {activeUser?.lastName}
                          </h3>
                          <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                            <p className="text-sm flex items-center gap-2 font-medium" style={{ color: "#8b7355" }}>
                              <Icon name="user" size={16} /> {activeUser?.email}
                            </p>
                            <p className="text-sm flex items-center gap-2 font-medium" style={{ color: "#8b7355" }}>
                              <Icon name="phone" size={16} /> {activeUser?.phone || "No phone provided"}
                            </p>
                          </div>
                          
                          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                            {activeUser?.employeeId && (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm" style={{ background: "rgba(154,0,2,0.08)", color: "#9a0002" }}>
                                ID: {String(activeUser.employeeId).padStart(6, "0")}
                              </span>
                            )}
                            {activeUser?.department && (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm" style={{ background: "#e8ddd0", color: "#5c4033" }}>
                                {activeUser.department}
                              </span>
                            )}
                            {activeUser?.position && (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm" style={{ background: "#e8ddd0", color: "#5c4033" }}>
                                {activeUser.position}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Edit Button */}
                        <Button onClick={openEditProfile} variant="outline" size="sm" className="mt-4 w-full max-w-[200px]" style={{ borderColor: "#9a0002", color: "#9a0002" }}>
                          Edit Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employment Details */}
                  <StaggerItem>
                    <Card className="border-0 shadow-md h-full" style={{ background: "#fffbf7" }}>
                      <CardHeader className="pb-3 border-b border-[#e8ddd0] mb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2" style={{ color: "#3d2b1f" }}>
                          <Icon name="file" size={18} /> Employment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Hire Date</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.hireDate || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Department</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.department || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Position</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.position || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Employee ID</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.employeeId ? String(activeUser.employeeId).padStart(6, "0") : "—"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>

                  {/* Compensation & Hours */}
                  <StaggerItem>
                    <Card className="border-0 shadow-md h-full" style={{ background: "#fffbf7" }}>
                      <CardHeader className="pb-3 border-b border-[#e8ddd0] mb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2" style={{ color: "#3d2b1f" }}>
                          <Icon name="dollar" size={18} /> Compensation & Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Base Salary</span>
                            <span className="text-sm font-black text-right" style={{ color: "#16a34a" }}>{activeUser?.baseSalary ? `$${activeUser.baseSalary.toLocaleString()}` : "—"}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Work Start Time</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.workStartTime ? activeUser.workStartTime.substring(0, 5) : "08:00 AM"}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-[#f5efe8]">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Work Hours / Day</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.workHoursPerDay != null ? `${activeUser.workHoursPerDay} hrs` : "8 hrs"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium" style={{ color: "#8b7355" }}>Working Days / Month</span>
                            <span className="text-sm font-bold text-right" style={{ color: "#3d2b1f" }}>{activeUser?.workingDaysPerMonth != null ? `${activeUser.workingDaysPerMonth} days` : "22 days"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                </div>

                {/* Leave Balances */}
                <StaggerItem>
                  <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                    <CardHeader className="pb-3 border-b border-[#e8ddd0] mb-4">
                      <CardTitle className="text-base font-bold flex items-center gap-2" style={{ color: "#3d2b1f" }}>
                        <Icon name="calendar" size={18} /> Leave Balances
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                          { label: "Annual Leave", used: user?.ilLeaveUsed ?? 0, total: user?.ilLeaveEntitlement ?? 18, color: "#3b82f6" },
                          { label: "Sick Leave", used: user?.sickLeaveUsed ?? 0, total: user?.sickLeaveEntitlement ?? 7, color: "#f59e0b" },
                          { label: "Special Leave", used: user?.specialLeaveUsed ?? 0, total: user?.specialLeaveEntitlement ?? 0, color: "#8b5cf6" },
                        ].map((lb) => {
                          const remaining = lb.total - lb.used;
                          const pct = lb.total > 0 ? Math.round((lb.used / lb.total) * 100) : 0;
                          return (
                            <div key={lb.label} className="rounded-xl p-5" style={{ background: "#f5efe8", border: "1px solid #e8ddd0" }}>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold" style={{ color: "#5c4033" }}>{lb.label}</span>
                                <span className="text-xs font-bold px-2 py-1 rounded-md bg-white shadow-sm" style={{ color: lb.color }}>{remaining} left</span>
                              </div>
                              <div className="flex items-baseline gap-1.5 mb-3">
                                <span className="text-3xl font-black" style={{ color: "#3d2b1f" }}>{remaining}</span>
                                <span className="text-sm font-medium" style={{ color: "#8b7355" }}>/ {lb.total} days</span>
                              </div>
                              <div className="h-2 w-full rounded-full overflow-hidden shadow-inner" style={{ background: "#e8ddd0" }}>
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: lb.color }} />
                              </div>
                              <p className="mt-2 text-xs font-medium" style={{ color: "#8b7355" }}>{lb.used} used ({pct}% consumed)</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>

                {/* Account Details */}
                <StaggerItem>
                  <Card className="border-0 shadow-md" style={{ background: "#fffbf7" }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold" style={{ color: "#3d2b1f" }}>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Role</label>
                          <Input readOnly value={(user?.roles || []).map((r) => typeof r === "object" ? r.name : r).join(", ") || "—"} className="bg-[#f5efe8] border-[#e8ddd0] text-[#5c4033]" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Status</label>
                          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "#e8ddd0", background: "#f5efe8" }}>
                            <span className="inline-block h-2 w-2 rounded-full" style={{ background: user?.active === false ? "#ef4444" : "#10b981" }} />
                            <span className="text-sm" style={{ color: "#5c4033" }}>{user?.active === false ? "Inactive" : "Active"}</span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Member Since</label>
                          <Input readOnly value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} className="bg-[#f5efe8] border-[#e8ddd0] text-[#5c4033]" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Last Updated</label>
                          <Input readOnly value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} className="bg-[#f5efe8] border-[#e8ddd0] text-[#5c4033]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              </div>
            )}

          </PageTransition>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Edit Profile Modal */}
      <Modal open={editProfile} onClose={() => setEditProfile(false)} title="Edit Profile" footer={
        <>
          <Button variant="outline" onClick={() => setEditProfile(false)} style={{ borderColor: "#d4c5b5", color: "#8b7355" }}>Cancel</Button>
          <Button onClick={handleProfileSave} disabled={profileLoading} style={{ background: "#9a0002" }}>{profileLoading ? "Saving…" : "Save Changes"}</Button>
        </>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>First Name</label><Input value={profileForm.firstName || ""} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} /></div>
            <div><label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Last Name</label><Input value={profileForm.lastName || ""} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} /></div>
          </div>
          <div><label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Phone</label><Input value={profileForm.phone || ""} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Enter phone number" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Department</label><Input value={profileForm.department || ""} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })} /></div>
            <div><label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8b7355" }}>Position</label><Input value={profileForm.position || ""} onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })} /></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;