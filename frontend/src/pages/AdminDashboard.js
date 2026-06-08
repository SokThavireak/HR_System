import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { adminService } from "../services/adminService";
import AttendancePage from "./AttendancePage";
import { ShaderAnimation } from "../components/ui/shader-animation";
import { SEED_DEPARTMENTS, SEED_POSITIONS, SEED_USERS } from "../data/seedData";
import {
  Button, Input, Select, Textarea,
  Card, CardHeader, CardTitle, CardContent,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  LoadingSkeleton, AdminDashboardSkeleton, AdminTableSkeleton, DeptPositionSkeleton,
  AdminAttendanceSkeleton, LeaveApprovalsSkeleton, PayrollSkeleton, PerformanceSkeleton,
  AttendancePageSkeleton,
  PageTransition, Modal,
} from "../components/ui";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/common/ToastContainer";

const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "home" },
  { key: "users", label: "User Management", icon: "users" },
  { key: "categories", label: "Department & Position", icon: "folder" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "leaves", label: "Leave Approvals", icon: "calendar" },
  { key: "payroll", label: "Payroll", icon: "dollar" },
  { key: "performance", label: "Performance", icon: "trending" },
];

const Icon = ({ name, size = 18 }) => {
  const s = size;
  const icons = {
    home: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    clock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    calendar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    dollar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    trending: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    logout: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    refresh: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    search: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trash: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    edit: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    eye: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    x: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    chart: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    folder: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    briefcase: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    alert: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  return icons[name] || null;
};

/* ─── localStorage-backed useState with seed support ─── */
function useLocalState(key, initial, seed) {
  const [v, setV] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (!Array.isArray(parsed) && typeof parsed === "object" && parsed !== null) return parsed;
      }
    } catch (e) {}
    // If empty/missing and seed provided, seed localStorage
    if (seed && Array.isArray(seed) && seed.length > 0) {
      try { localStorage.setItem(key, JSON.stringify(seed)); } catch (e) {}
      return seed;
    }
    return initial;
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }, [key, v]);
  const isArrayMode = Array.isArray(initial);
  const safeV = v != null ? v : (isArrayMode ? initial : initial);
  return [safeV, setV];
}

/* ─── Stat Card ─── */
function StatCard({ bg, value, label, iconName }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: bg }}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: bg }}>
        <Icon name={iconName} size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}


export default function AdminDashboard({ user }) {
  // Role guard — if a non-admin somehow lands here, force redirect
  const userRoles = (user?.roles || []).map((r) => (typeof r === "object" ? r.name : r));
  if (!userRoles.includes("ROLE_HR_ADMIN")) {
    localStorage.clear();
    window.location.reload();
    return null;
  }

  const [section, _setSection] = useState(() => sessionStorage.getItem("admin_section") || "dashboard");
  const setSection = (key) => { _setSection(key); sessionStorage.setItem("admin_section", key); };
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNavY, setActiveNavY] = useState(0);
  const [activeNavH, setActiveNavH] = useState(44);
  const navItemRefs = React.useRef([]);
  const navRef = React.useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  // Calculate sliding indicator position & height to match active nav item exactly
  const updateActiveNavY = React.useCallback(() => {
    const idx = SIDEBAR_ITEMS.findIndex((s) => s.key === section);
    const el = navItemRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      // offsetTop is relative to the nav container since it's position:relative
      setActiveNavY(el.offsetTop);
      setActiveNavH(el.offsetHeight);
    }
  }, [section]);

  // Update indicator on section change & mount
  useEffect(() => {
    // Small delay so DOM is ready
    const t = setTimeout(updateActiveNavY, 50);
    return () => clearTimeout(t);
  }, [updateActiveNavY]);

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

  return (
    <div className="min-h-screen" style={{ background: "#efe6dd" }}>

      {/* ═══ SHADER BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ShaderAnimation theme="light" />
      </div>

      {/* ══════════════════════════════════════════
          SIDEBAR — Cherry Cola #9a0002
          ══════════════════════════════════════════ */}
      <aside className="z-50 flex h-screen w-[260px] flex-col" style={{ position: "fixed", left: 0, top: 0, background: "#9a0002" }}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="px-3 pb-8 pt-8 animate-nav-item-fade" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 rounded-xl px-3 py-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Icon name="chart" size={24} />
              </div>
              <div className="min-w-0">
                <span className="text-2xl font-black leading-none tracking-tight text-white">HRMS</span>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav ref={navRef} className="relative flex flex-1 flex-col px-3">
            {/* Sliding active indicator pill — matches nav item height exactly */}
            <div
              className="absolute left-3 right-3 rounded-xl pointer-events-none overflow-hidden"
              style={{
                height: activeNavH,
                top: activeNavY,
                background: "rgba(255,255,255,0.18)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)",
                transition: "top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease",
              }}
            >
              {/* Accent bar inside the pill — clipped by overflow-hidden */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 0 12px 2px rgba(255,255,255,0.4)",
                }}
              />
            </div>
            {SIDEBAR_ITEMS.map((item, idx) => {
              const isActive = section === item.key;
              return (
                <button
                  key={item.key}
                  ref={el => { navItemRefs.current[idx] = el; }}
                  onClick={() => { updateActiveNavY(); setSection(item.key); }}
                  className={`animate-sidebar-item relative z-10 flex w-full items-center gap-3 rounded-xl px-3 text-sm font-medium cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    minHeight: "44px",
                    animationDelay: `${0.15 + idx * 0.06}s`,
                  }}
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

          {/* User section at bottom */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-[10px] text-white/50">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { localStorage.removeItem("hrms_token"); localStorage.removeItem("hrms_user"); localStorage.removeItem("hrms_login_time"); localStorage.removeItem("hrms_role"); window.location.reload(); }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white cursor-pointer"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <Icon name="logout" size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN — transparent, shows body #efe6dd
          ══════════════════════════════════════════ */}
      <div className="relative z-10 flex h-screen flex-col" style={{ marginLeft: 260, background: "transparent" }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-50 flex h-32 shrink-0 items-center justify-between px-8 border-b border-gray-200/50 backdrop-blur-md transition-transform duration-300 ease-in-out" style={{ background: "transparent", transform: navVisible ? "translateY(0)" : "translateY(-100%)" }}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(154, 0, 2, 0.1)" }}>
              <Icon name={SIDEBAR_ITEMS.find((s) => s.key === section)?.icon || "home"} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground animate-header-title">
                {SIDEBAR_ITEMS.find((s) => s.key === section)?.label || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 animate-header-right">
            <time className="text-sm text-muted-foreground animate-header-time">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </time>
            <button
              onClick={() => window.location.reload()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-muted-foreground hover:bg-gray-200 hover:text-foreground transition-colors cursor-pointer"
              title="Refresh page"
            >
              <Icon name="refresh" size={16} />
            </button>
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto p-8" style={{ background: "transparent" }}>
          <PageTransition variant="fadeUp" keyProp={section}>
            {section === "dashboard" && <DashboardView user={user} />}
            {section === "users" && <UserManagementView />}
            {section === "categories" && <CategoryView />}
            {section === "attendance" && <AttendancePage showSidebar={false} admin />}
            {section === "leaves" && <LeaveApprovalsView showToast={showToast} />}
            {section === "payroll" && <PayrollView showToast={showToast} />}
            {section === "performance" && <PerformanceView showToast={showToast} />}
          </PageTransition>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEPARTMENT & POSITION MANAGEMENT
   ═══════════════════════════════════════════ */
function CategoryView() {
  const [departments, setDepartments] = useLocalState("cat-departments", [], SEED_DEPARTMENTS);
  const [positions, setPositions] = useLocalState("cat-positions", [], SEED_POSITIONS);
  const [activeTab, setActiveTab] = useState("departments");
  const [loading, setLoading] = useState(true);

  // Department form
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  const [editDeptId, setEditDeptId] = useState(null);

  // Position form
  const [posForm, setPosForm] = useState({ title: "", description: "", departmentId: "" });
  const [editPosId, setEditPosId] = useState(null);

  // Load from API on mount (falls back to seed data if API fails)
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      adminService.getDepartmentList().then((r) => { const d = Array.isArray(r.data) ? r.data : (r.data?.content || []); if (d.length) setDepartments(d); }),
      adminService.getPositionList().then((r) => { const d = Array.isArray(r.data) ? r.data : (r.data?.content || []); if (d.length) setPositions(d); }),
    ]).catch((e) => console.error("[CategoryView] API load failed:", e))
     .finally(() => setLoading(false));
  }, []);

  // Department CRUD
  const saveDept = async (e) => {
    e.preventDefault();
    try {
      if (editDeptId !== null) {
        await adminService.updateDepartment(editDeptId, deptForm);
        setDepartments(departments.map((d) => (d.id === editDeptId ? { ...d, ...deptForm } : d)));
        setEditDeptId(null);
      } else {
        const res = await adminService.createDepartment(deptForm);
        setDepartments([...departments, res.data]);
      }
      setDeptForm({ name: "", description: "" });
    } catch (err) { alert("Failed: " + (err.message || "Unknown error")); }
  };

  const deleteDept = async (id) => {
    if (!confirm("Delete this department?")) return;
    try {
      await adminService.deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
      setPositions(positions.filter((p) => p.departmentId !== id));
    } catch (err) { alert("Failed: " + (err.message || "Unknown error")); }
  };

  const startEditDept = (dept) => {
    setEditDeptId(dept.id);
    setDeptForm({ name: dept.name, description: dept.description });
  };

  // Position CRUD
  const savePos = async (e) => {
    e.preventDefault();
    try {
      if (editPosId !== null) {
        await adminService.updatePosition(editPosId, posForm);
        setPositions(positions.map((p) => (p.id === editPosId ? { ...p, ...posForm, department: departments.find(d => d.id === Number(posForm.departmentId))?.name || p.department } : p)));
        setEditPosId(null);
      } else {
        const res = await adminService.createPosition(posForm);
        const newPos = res.data;
        newPos.department = departments.find(d => d.id === Number(posForm.departmentId))?.name || "";
        setPositions([...positions, newPos]);
      }
      setPosForm({ title: "", description: "", departmentId: "" });
    } catch (err) { alert("Failed: " + (err.message || "Unknown error")); }
  };

  const deletePos = async (id) => {
    if (!confirm("Delete this position?")) return;
    try {
      await adminService.deletePosition(id);
      setPositions(positions.filter((p) => p.id !== id));
    } catch (err) { alert("Failed: " + (err.message || "Unknown error")); }
  };

  const startEditPos = (pos) => {
    setEditPosId(pos.id);
    setPosForm({ title: pos.title, description: pos.description, departmentId: String(pos.departmentId || "") });
  };

  if (loading) return <DeptPositionSkeleton />;

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0}>
        <div>
          <h2 className="text-2xl font-bold">Department & Position</h2>
          <p className="text-sm text-muted-foreground">Manage departments and job positions across the organization.</p>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StaggerItem>
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#9a0002" }}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "#9a0002" }}>
              <Icon name="folder" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{departments.length}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">Total Departments</p>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "#3b82f6" }}>
              <Icon name="briefcase" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{positions.length}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">Total Positions</p>
            </div>
          </div>
        </StaggerItem>
      </div>

      {/* Tabs */}
      <div className="relative flex gap-1 rounded-xl bg-gray-100 p-1">
        {/* Sliding active indicator pill — mirrors sidebar nav animation */}
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            width: "calc(50% - 4px)",
            height: "calc(100% - 8px)",
            top: "4px",
            left: activeTab === "departments" ? "4px" : "calc(50% + 4px)",
            background: "#9a0002",
            boxShadow: "0 4px 16px rgba(154,0,2,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "left 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <button
          onClick={() => setActiveTab("departments")}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
            activeTab === "departments" ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon name="folder" size={14} className="mr-1.5 inline-block" /> Departments
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
            activeTab === "positions" ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon name="briefcase" size={14} className="mr-1.5 inline-block" /> Positions
        </button>
      </div>

      {/* ═══ DEPARTMENTS TAB ═══ */}
      {activeTab === "departments" && (
        <div className="space-y-6 tab-card-stagger animate-tab-slide-left" key="dept-tab">
          <Card className="card-stagger-item">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon name="plus" size={16} className="text-primary" />
                {editDeptId !== null ? "Edit Department" : "Add New Department"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveDept} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Department Name</label>
                    <Input value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} placeholder="e.g. Engineering" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                    <Input value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} placeholder="Brief description..." />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editDeptId !== null ? "Update Department" : "Add Department"}</Button>
                  {editDeptId !== null && (
                    <Button type="button" variant="outline" onClick={() => { setEditDeptId(null); setDeptForm({ name: "", description: "" }); }}>Cancel</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="card-stagger-item">
            <CardHeader className="pb-3"><CardTitle className="text-base">All Departments ({departments.length})</CardTitle></CardHeader>
            <CardContent>
              {!departments.length ? (
                <p className="py-8 text-center text-muted-foreground">No departments yet. Add one above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="text-muted-foreground">{dept.description || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button onClick={() => startEditDept(dept)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Icon name="edit" size={14} /></button>
                            <button onClick={() => deleteDept(dept.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"><Icon name="trash" size={14} /></button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ POSITIONS TAB ═══ */}
      {activeTab === "positions" && (
        <div className="space-y-6 tab-card-stagger animate-tab-slide-right" key="pos-tab">
          <Card className="card-stagger-item">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon name="plus" size={16} className="text-primary" />
                {editPosId !== null ? "Edit Position" : "Add New Position"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePos} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Position Title</label>
                    <Input value={posForm.title} onChange={(e) => setPosForm({ ...posForm, title: e.target.value })} placeholder="e.g. Software Engineer" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                    <Select value={posForm.departmentId} onChange={(e) => setPosForm({ ...posForm, departmentId: e.target.value })} required>
                      <option value="">Select department...</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                    <Input value={posForm.description} onChange={(e) => setPosForm({ ...posForm, description: e.target.value })} placeholder="Brief description..." />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editPosId !== null ? "Update Position" : "Add Position"}</Button>
                  {editPosId !== null && (
                    <Button type="button" variant="outline" onClick={() => { setEditPosId(null); setPosForm({ title: "", description: "", departmentId: "" }); }}>Cancel</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="card-stagger-item">
            <CardHeader className="pb-3"><CardTitle className="text-base">All Positions ({positions.length})</CardTitle></CardHeader>
            <CardContent>
              {!positions.length ? (
                <p className="py-8 text-center text-muted-foreground">No positions yet. Add one above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((pos) => (
                      <TableRow
                        key={pos.id}
                        style={editPosId === pos.id ? { animation: "posRowFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards", background: "hsla(358, 100%, 30%, 0.07)" } : undefined}
                      >
                        <TableCell className="font-medium">{pos.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {typeof pos.department === "object" ? pos.department?.name : pos.department || departments.find(d => d.id === pos.departmentId)?.name || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{pos.description || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button onClick={() => startEditPos(pos)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Icon name="edit" size={14} /></button>
                            <button onClick={() => deletePos(pos.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"><Icon name="trash" size={14} /></button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINI BAR CHART
   ═══════════════════════════════════════════ */
function MiniBar({ value, max, color, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-1 flex-col items-center gap-1">
        <span className="text-xs font-semibold">{value}</span>
        <div className="w-full rounded-t-md transition-all duration-700 ease-out" style={{ height: `${Math.max(pct, 4)}%`, background: color, minHeight: 4 }} />
        <span className="text-[10px] text-muted-foreground truncate w-full text-center">{label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DONUT CHART (SVG)
   ═══════════════════════════════════════════ */
function DonutChart({ segments, size = 120 }) {
  const strokeWidth = Math.round(size * 0.18);
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumAngle = -90;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        ) : segments.map((seg, i) => {
          const angle = (seg.value / total) * 360;
          const startAngle = cumAngle;
          cumAngle += angle;
          const endAngle = cumAngle;
          const largeArc = angle > 180 ? 1 : 0;
          const r = radius;
          const sx = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const sy = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const ex = cx + r * Math.cos((endAngle * Math.PI) / 180);
          const ey = cy + r * Math.sin((endAngle * Math.PI) / 180);
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey} Z`}
              fill={seg.color}
              stroke="white"
              strokeWidth={3}
            />
          );
        })}
        <text x={cx} y={cy} textAnchor="middle" dy="-4" className="font-bold" fill="#111" fontSize={size * 0.18}>{total}</text>
        <text x={cx} y={cy} textAnchor="middle" dy={size * 0.1} fill="#888" fontSize={size * 0.09}>Total</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-muted-foreground">{seg.label}</span>
            <span className="text-xs font-bold">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD OVERVIEW
   ═══════════════════════════════════════════ */
function DashboardView({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    adminService.getDashboardStats()
      .then((r) => setStats(r.data))
      .catch((e) => console.error("[Dashboard] API load failed:", e))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <AdminDashboardSkeleton />;

  const maxCardVal = stats
    ? Math.max(stats.totalEmployees, stats.pendingLeaves, stats.totalPayroll / 1000, parseFloat(stats.attendanceRate) / 10)
    : 1;

  const DEPT_COLORS = {
    "Engineering": "#3b82f6",
    "Marketing": "#f59e0b",
    "Finance": "#22c55e",
    "Human Resources": "#9a0002",
    "Sales": "#f97316",
    "Operations": "#8b5cf6",
    "Design": "#ec4899",
    "Legal": "#14b8a6",
    "Customer Support": "#06b6d4",
  };
  const rawBreakdown = stats?.departmentBreakdown || [];
  const deptData = rawBreakdown.map((d) => ({
    label: d.department,
    value: d.count,
    color: DEPT_COLORS[d.department] || "#6b7280",
  }));

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
        <div>
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName || "Admin"}! Here's your dashboard summary.</p>
        </div>
      </ScrollReveal>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem><StatCard bg="#9a0002" value={stats.totalEmployees} label="Total Employees" iconName="users" /></StaggerItem>
        <StaggerItem><StatCard bg="#22c55e" value={`${stats.attendanceRate}%`} label="Attendance Rate" iconName="check" /></StaggerItem>
        <StaggerItem><StatCard bg="#f59e0b" value={stats.pendingLeaves} label="Pending Leaves" iconName="clock" /></StaggerItem>
        <StaggerItem><StatCard bg="#ef4444" value={`$${stats.totalPayroll}`} label="Monthly Payroll" iconName="dollar" /></StaggerItem>
      </div>

      {/* Payroll Breakdown Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#6366f1" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: "#6366f1" }}>
                <Icon name="dollar" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Avg. Salary</p>
                <p className="text-lg font-bold">${stats.totalEmployees > 0 ? Math.round(stats.totalPayroll / stats.totalEmployees) : 0}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#14b8a6" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: "#14b8a6" }}>
                <Icon name="clock" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">On-time Rate</p>
                <p className="text-lg font-bold">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#ec4899" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: "#ec4899" }}>
                <Icon name="trending" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Performance Avg</p>
                <p className="text-lg font-bold">4.2/5</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#f97316" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: "#f97316" }}>
                <Icon name="calendar" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Approved Leaves</p>
                <p className="text-lg font-bold">{Math.max(0, (stats.pendingLeaves || 0) - 1)}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
      </div>

      {/* ── Employees by Department ── */}
      <ScrollReveal variant="fadeUp" stagger={0.08}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Icon name="folder" size={16} /> Employees by Department</CardTitle>
              <span className="text-xs text-muted-foreground">{stats.totalEmployees} total employees</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="flex items-center justify-center lg:col-span-2">
                <DonutChart segments={deptData} size={200} />
              </div>
              <div className="lg:col-span-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead className="w-[40%]">Distribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deptData.map((dept, i) => {
                      const pct = stats.totalEmployees > 0 ? Math.round((dept.value / stats.totalEmployees) * 100) : 0;
                      return (
                        <TableRow key={dept.label}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full shrink-0" style={{ background: dept.color }} />
                              <span className="font-medium">{dept.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">{dept.value}</TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold" style={{ color: dept.color }}>{pct}%</span>
                          </TableCell>
                          <TableCell>
                            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: dept.color }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow style={{ background: "rgba(0,0,0,0.02)" }}>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">{stats.totalEmployees}</TableCell>
                      <TableCell className="font-bold">100%</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* ── Weekly Attendance Trend ── */}
      <ScrollReveal variant="fadeUp" stagger={0.08}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Icon name="chart" size={16} /> Weekly Attendance Trend</CardTitle>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> ≥90% Excellent</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> 60-89% Average</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> &lt;60% Low</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Monday",    val: 95, count: Math.ceil(stats.totalEmployees * 0.95), total: stats.totalEmployees },
                { label: "Tuesday",   val: 88, count: Math.ceil(stats.totalEmployees * 0.88), total: stats.totalEmployees },
                { label: "Wednesday", val: 92, count: Math.ceil(stats.totalEmployees * 0.92), total: stats.totalEmployees },
                { label: "Thursday",  val: 97, count: Math.ceil(stats.totalEmployees * 0.97), total: stats.totalEmployees },
                { label: "Friday",    val: 85, count: Math.ceil(stats.totalEmployees * 0.85), total: stats.totalEmployees },
                { label: "Saturday",  val: 45, count: Math.ceil(stats.totalEmployees * 0.45), total: stats.totalEmployees },
                { label: "Sunday",    val: 12, count: Math.ceil(stats.totalEmployees * 0.12), total: stats.totalEmployees },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-4">
                  <span className="w-20 text-right text-xs font-medium text-muted-foreground shrink-0">{d.label}</span>
                  <div className="flex-1 h-8 rounded-lg bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                      style={{
                        width: `${d.val}%`,
                        background: d.val > 90 ? "linear-gradient(90deg, #22c55e, #16a34a)" : d.val > 60 ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, #ef4444, #dc2626)",
                      }}
                    >
                      <span className="text-[11px] font-bold text-white drop-shadow-sm">{d.val}%</span>
                    </div>
                  </div>
                  <span className="w-24 text-xs text-muted-foreground shrink-0">{d.count}/{d.total} present</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">Weekly Average</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-emerald-600">{Math.round((95 + 88 + 92 + 97 + 85 + 45 + 12) / 7)}%</span>
                <span className="text-[10px] text-muted-foreground">73 of {stats.totalEmployees} avg/day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* ── Recent Activity ── */}
      <ScrollReveal variant="fadeUp" stagger={0.1}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Icon name="check" size={16} /> Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: "New employee John Doe added to Engineering", time: "2 min ago", bg: "#7A6BFF" },
                { text: "Leave request from Jane Smith approved", time: "15 min ago", bg: "#22c55e" },
                { text: "Payroll for March processed", time: "1 hour ago", bg: "#f59e0b" },
                { text: "Performance review submitted for Alice Johnson", time: "3 hours ago", bg: "#3b82f6" },
                { text: "Bob Kim marked attendance for today", time: "5 hours ago", bg: "#ec4899" },
                { text: "New leave request from John Smith", time: "1 day ago", bg: "#f59e0b" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.bg }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   USER MANAGEMENT
   ═══════════════════════════════════════════ */
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useLocalState("am-search", "");
  const [filterEmployeeId, setFilterEmployeeId] = useLocalState("am-filterEmployeeId", "");
  const [form, setForm] = useLocalState("am-form", { employeeId: "", firstName: "", lastName: "", email: "", phone: "", department: "", position: "", baseSalary: "", hireDate: "", role: "ROLE_EMPLOYEE", password: "changeme" });
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [departments] = useLocalState("cat-departments", [], SEED_DEPARTMENTS);
  const [positions] = useLocalState("cat-positions", [], SEED_POSITIONS);

  const load = () => {
    setLoading(true);
    adminService.getUsers(search, 0, 100)
      .then((r) => {
        const page = r.data;
        const data = page.content || page;
        setUsers(data || []);
      })
      .catch((e) => { console.error("[UserManagement] API load failed:", e); setUsers([]); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  // Filter positions by selected department
  const filteredPositions = form.department
    ? positions.filter((p) => p.department === form.department)
    : positions;

  const resetForm = () => {
    setForm({ employeeId: "", firstName: "", lastName: "", email: "", phone: "", department: "", position: "", baseSalary: "", workHoursPerDay: "", workingDaysPerMonth: "", workStartTime: "", hireDate: "", role: "ROLE_EMPLOYEE", password: "changeme" });
    setEditUserId(null);
  };

  const create = async (e) => {
    e.preventDefault();
    const cleaned = { ...form };
    ["baseSalary", "workHoursPerDay", "workingDaysPerMonth", "workStartTime", "hireDate", "phone"].forEach((k) => {
      if (cleaned[k] === "" || cleaned[k] === undefined) cleaned[k] = null;
    });
    await adminService.createUser(cleaned);
    resetForm();
    load();
  };

  const startEdit = (u) => {
    setEditUserId(u.id);
    setForm({
      employeeId: u.employeeId || "",
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      phone: u.phone || "",
      department: u.department || "",
      position: u.position || "",
      baseSalary: u.baseSalary || "",
      workHoursPerDay: u.workHoursPerDay || "",
      workingDaysPerMonth: u.workingDaysPerMonth || "",
      workStartTime: u.workStartTime || "",
      hireDate: u.hireDate || "",
      role: (u.roles || []).some((r) => r.name === "ROLE_HR_ADMIN") ? "ROLE_HR_ADMIN" : "ROLE_EMPLOYEE",
      password: "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    // Clean empty strings to null so backend doesn't choke on parsing
    const cleaned = { ...form };
    ["baseSalary", "workHoursPerDay", "workingDaysPerMonth", "workStartTime", "hireDate", "phone"].forEach((k) => {
      if (cleaned[k] === "" || cleaned[k] === undefined) cleaned[k] = null;
    });
    await adminService.updateUser(editUserId, cleaned);
    resetForm();
    load();
  };

  const deactivate = async (u) => { if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) { await adminService.deactivateUser(u.id); load(); } };
  const activate = async (u) => { await adminService.activateUser(u.id); load(); };
  const resetPwd = async (u) => { const pw = prompt("New password:"); if (pw) await adminService.resetPassword(u.id, pw); };
  const remove = async (u) => { if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) { await adminService.deactivateUser(u.id); load(); } };

  const TEXT_FIELDS = [
    { k: "firstName", l: "First Name", required: true },
    { k: "lastName", l: "Last Name", required: true },
    { k: "email", l: "Email", type: "email", required: true },
    { k: "phone", l: "Phone", required: false },
    { k: "baseSalary", l: "Base Salary ($)", type: "number", required: false },
    { k: "workHoursPerDay", l: "Work Hours/Day", type: "number", required: false },
    { k: "workingDaysPerMonth", l: "Working Days/Month", type: "number", required: false },
    { k: "workStartTime", l: "Work Start Time", type: "time", required: false },
    { k: "hireDate", l: "Hire Date", type: "date", required: false },
  ];

  if (loading) return <AdminTableSkeleton />;

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0}>
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage employees, assign departments & positions.</p>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#9a0002" }}>
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Total Users</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#10b981" }}>
            <p className="text-2xl font-bold">{users.filter((u) => u.active).length}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Active</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#6b7280" }}>
            <p className="text-2xl font-bold">{users.filter((u) => !u.active).length}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Inactive</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}>
            <p className="text-2xl font-bold">{departments.length}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Departments</p>
          </div>
        </StaggerItem>
      </div>

      {/* Add / Edit Form */}
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon name={editUserId ? "edit" : "plus"} size={16} className="text-primary" />
            {editUserId !== null ? "Edit Employee" : "Add New Employee"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {departments.length === 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <Icon name="alert" size={16} />
              No departments or positions found. Please add them in <strong>Department & Position</strong> first.
            </div>
          )}
          <form onSubmit={editUserId !== null ? saveEdit : create} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEXT_FIELDS.map(({ k, l, type = "text", required = false }) => (
                <div key={k}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{l}</label>
                  <Input type={type} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={required} />
                </div>
              ))}
              {/* Department Select */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                <Select
                  value={form.department || ""}
                  onChange={(e) => setForm({ ...form, department: e.target.value, position: "" })}
                  required
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </Select>
              </div>
              {/* Position Select */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Position</label>
                <Select
                  value={form.position || ""}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  required
                  disabled={!form.department}
                >
                  <option value="">Select position...</option>
                  {filteredPositions.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </Select>
                {form.department && filteredPositions.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">No positions for this department.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
                {editUserId !== null ? (
                  <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                    <span className="font-mono text-sm font-semibold text-primary">{form.employeeId || "—"}</span>
                  </div>
                ) : (
                  <Input value={form.employeeId || ""} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="Auto-generated if left blank" />
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Role</label>
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="ROLE_EMPLOYEE">Employee</option>
                  <option value="ROLE_HR_ADMIN">HR Admin</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{editUserId ? "New Password (optional)" : "Temp Password"}</label>
                <Input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editUserId ? "Leave blank to keep current" : ""} />
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" disabled={departments.length === 0}>
                  {editUserId !== null ? <><Icon name="check" size={14} /> Save Changes</> : <><Icon name="plus" size={14} /> Create</>}
                </Button>
                {editUserId !== null && (
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      </ScrollReveal>

      {/* Search + Filter */}
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search name, email, dept…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Input placeholder="Filter by Employee ID…" value={filterEmployeeId} onChange={(e) => setFilterEmployeeId(e.target.value)} className="max-w-[220px]" />
          {filterEmployeeId && (
            <Button onClick={() => setFilterEmployeeId("")} variant="ghost" size="sm">
              <Icon name="x" size={12} /> Clear ID
            </Button>
          )}
          <Button onClick={load} variant="outline"><Icon name="search" size={14} /> Search</Button>
          <Button onClick={load} variant="secondary"><Icon name="refresh" size={14} /> Refresh</Button>
        </div>
      </ScrollReveal>

      {/* Table */}
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Employees ({users.filter((u) => !filterEmployeeId || (u.employeeId && u.employeeId.includes(filterEmployeeId))).length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading…</p>
          ) : !users.length ? (
            <p className="py-8 text-center text-muted-foreground">No employees found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leave Balance</TableHead>
                  <TableHead className="w-[130px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter((u) => {
                  if (!filterEmployeeId) return true;
                  return u.employeeId && u.employeeId.includes(filterEmployeeId);
                }).map((u) => {
                  const isAdmin = (u.roles || []).some((r) => r.name === "ROLE_HR_ADMIN");
                  const saving = editUserId === u.id;
                  return (
                    <TableRow key={u.id} style={saving ? { background: "rgba(59,130,246,0.04)" } : undefined}>
                      <TableCell><span className="font-mono text-xs font-semibold text-primary">{u.employeeId || "—"}</span></TableCell>
                      <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        {u.department ? <Badge variant="outline">{u.department}</Badge> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {u.position ? <Badge variant="outline" style={{ background: "#eff6ff", color: "#3b82f6", borderColor: "#bfdbfe" }}>{u.position}</Badge> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-semibold">{u.baseSalary ? `$${u.baseSalary}` : "—"}</TableCell>
                      <TableCell><Badge variant={isAdmin ? "default" : "outline"}>{isAdmin ? "Admin" : "Employee"}</Badge></TableCell>
                      <TableCell><Badge variant={u.active ? "success" : "destructive"}>{u.active ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-[10px] leading-tight">
                          <span className="inline-flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" /> IL: {u.ilLeaveEntitlement != null ? `${u.ilLeaveEntitlement - (u.ilLeaveUsed || 0)}/${u.ilLeaveEntitlement}` : "—"}</span>
                          <span className="inline-flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" /> Sick: {u.sickLeaveEntitlement != null ? `${u.sickLeaveEntitlement - (u.sickLeaveUsed || 0)}/${u.sickLeaveEntitlement}` : "—"}</span>
                          <span className="inline-flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500" /> Special: {u.specialLeaveEntitlement != null ? `${u.specialLeaveEntitlement - (u.specialLeaveUsed || 0)}/${u.specialLeaveEntitlement}` : "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button title="Edit" onClick={() => startEdit(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Icon name="edit" size={14} /></button>
                          {!u.active ? <button title="Activate" onClick={() => activate(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"><Icon name="check" size={14} /></button> : <button title="Deactivate" onClick={() => deactivate(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"><Icon name="x" size={14} /></button>}
                          <button title="Reset Pwd" onClick={() => resetPwd(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"><Icon name="refresh" size={14} /></button>
                          <button title="Delete" onClick={() => remove(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"><Icon name="trash" size={14} /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </ScrollReveal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LEAVE APPROVALS
   ═══════════════════════════════════════════ */
function LeaveApprovalsView({ showToast }) {
  const [leaves, setLeaves] = useLocalState("al-leaves", []);
  const [historyLeaves, setHistoryLeaves] = useLocalState("al-leaves-history", []);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailView, setDetailView] = useState(null);
  const [editLeave, setEditLeave] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const editFormRef = useRef(null);

  const loadPending = useCallback(() => {
    setLoading(true);
    adminService.getLeaves("PENDING")
      .then((r) => setLeaves(r.data.content || r.data))
      .catch((e) => { console.error("[LeaveApprovals] API load failed:", e); showToast("Failed to load pending leaves", "error"); })
      .finally(() => setLoading(false));
  }, [setLeaves, showToast]);

  const loadHistory = useCallback(() => {
    setHistoryLoading(true);
    Promise.allSettled([
      adminService.getLeaves("APPROVED"),
      adminService.getLeaves("REJECTED"),
    ])
      .then((results) => {
        const all = [];
        results.forEach((res) => {
          if (res.status === "fulfilled") {
            all.push(...(res.value.data.content || res.value.data || []));
          }
        });
        all.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
        setHistoryLeaves(all);
      })
      .catch((e) => { console.error("[LeaveApprovals] History load failed:", e); showToast("Failed to load leave history", "error"); })
      .finally(() => setHistoryLoading(false));
  }, [setHistoryLeaves, showToast]);

  useEffect(() => { loadPending(); loadHistory(); }, [loadPending, loadHistory]);

  const approve = async (id) => {
    setActionLoading(id);
    try {
      await adminService.approveLeave(id);
      showToast("Leave approved successfully", "success");
      loadPending();
      loadHistory();
    } catch (err) {
      showToast("Failed to approve: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    const id = rejectTarget;
    setRejectTarget(null);
    setRejectReason("");
    setActionLoading(id);
    try {
      await adminService.rejectLeave(id, rejectReason);
      showToast("Leave rejected", "success");
      loadPending();
      loadHistory();
    } catch (err) {
      showToast("Failed to reject: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const openDetail = async (id) => {
    try {
      const r = await adminService.getLeave(id);
      setDetailView(r.data);
    } catch (err) {
      showToast("Failed to load details", "error");
    }
  };

  const openEdit = (lv) => {
    setEditLeave(lv);
    setEditForm({
      leaveType: lv.leaveType || "IL",
      startDate: lv.startDate || "",
      endDate: lv.endDate || "",
      reason: lv.reason || "",
    });
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLeave || !editForm) return;
    setEditLoading(true);
    try {
      await adminService.updateLeave(editLeave.id, {
        leaveType: editForm.leaveType,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        reason: editForm.reason,
      });
      showToast("Leave request updated successfully", "success");
      setEditLeave(null);
      setEditForm(null);
      loadPending();
      loadHistory();
    } catch (err) {
      showToast("Failed to update: " + (err?.message || "Unknown error"), "error");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <Button onClick={() => { loadPending(); loadHistory(); }} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
        </div>
      </ScrollReveal>

      {/* Tabs */}
      <div className="relative flex gap-1 rounded-xl bg-gray-100 p-1">
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            width: "calc(50% - 4px)",
            height: "calc(100% - 8px)",
            top: "4px",
            left: activeTab === "pending" ? "4px" : "calc(50% + 4px)",
            background: "#9a0002",
            boxShadow: "0 4px 16px rgba(154,0,2,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "left 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <button
          onClick={() => setActiveTab("pending")}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 cursor-pointer ${activeTab === "pending" ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          Pending {leaves.length > 0 && <span className={`ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${activeTab === "pending" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{leaves.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 cursor-pointer ${activeTab === "history" ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          History {historyLeaves.length > 0 && <span className={`ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${activeTab === "history" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{historyLeaves.length}</span>}
        </button>
      </div>

      {/* ═══ PENDING TAB ═══ */}
      {activeTab === "pending" && (
        <div className="space-y-6 tab-card-stagger animate-tab-slide-left" key="pending-tab">
          <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.15}>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Pending Requests ({leaves.length})</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <LeaveApprovalsSkeleton />
                ) : !leaves.length ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                      <Icon name="check" size={24} />
                    </div>
                    <p className="font-medium text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground">No pending leave requests.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {leaves.map((lv) => (
                        <TableRow key={lv.id} style={actionLoading === lv.id ? { opacity: 0.5 } : undefined}>
                          <TableCell className="font-medium">{(lv.user || {}).firstName} {(lv.user || {}).lastName}</TableCell>
                          <TableCell><Badge variant="outline">{lv.leaveType}</Badge></TableCell>
                          <TableCell>{lv.startDate}</TableCell><TableCell>{lv.endDate}</TableCell><TableCell>{lv.totalDays}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{lv.reason}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <button onClick={() => approve(lv.id)} title="Approve" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"><Icon name="check" size={14} /></button>
                              <button onClick={() => { setRejectTarget(lv.id); setRejectReason(""); }} title="Reject" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="x" size={14} /></button>
                              <button onClick={() => openDetail(lv.id)} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      )}

      {/* ═══ HISTORY TAB ═══ */}
      {activeTab === "history" && (
        <div className="space-y-6 tab-card-stagger animate-tab-slide-right" key="history-tab">
          <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.15}>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Leave History ({historyLeaves.length})</CardTitle></CardHeader>
              <CardContent>
                {historyLoading ? (
                  <p className="py-8 text-center text-muted-foreground">Loading…</p>
                ) : !historyLeaves.length ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Icon name="calendar" size={24} />
                    </div>
                    <p className="font-medium text-muted-foreground">No history yet</p>
                    <p className="text-xs text-muted-foreground">Approved and rejected leaves will appear here.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead>Reason</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {historyLeaves.map((lv) => (
                        <TableRow key={lv.id}>
                          <TableCell className="font-medium">{(lv.user || {}).firstName} {(lv.user || {}).lastName}</TableCell>
                          <TableCell><Badge variant="outline">{lv.leaveType}</Badge></TableCell>
                          <TableCell>{lv.startDate}</TableCell><TableCell>{lv.endDate}</TableCell><TableCell>{lv.totalDays}</TableCell>
                          <TableCell>
                            <Badge variant={lv.status === "APPROVED" ? "success" : "destructive"}>{lv.status}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{lv.reason}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <button onClick={() => openDetail(lv.id)} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                              <button onClick={() => openEdit(lv)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer"><Icon name="edit" size={14} /></button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason(""); }}
        title="Reject Leave Request"
        footer={
          <>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); }}>Cancel</Button>
            <Button onClick={reject} variant="destructive" disabled={!rejectReason.trim()}>Reject</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Please provide a reason for rejecting this leave request.</p>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Rejection Reason *</label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Insufficient staffing during this period..."
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* Detail View Modal */}
      <Modal
        open={!!detailView}
        onClose={() => setDetailView(null)}
        title="Leave Request Details"
        footer={
          <Button variant="outline" onClick={() => setDetailView(null)}>Close</Button>
        }
      >
        {detailView && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Employee</p><p className="font-semibold">{(detailView.user || {}).firstName} {(detailView.user || {}).lastName}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Status</p><Badge variant={detailView.status === "APPROVED" ? "success" : detailView.status === "REJECTED" ? "destructive" : "warning"}>{detailView.status}</Badge></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Type</p><p className="font-semibold">{detailView.leaveType}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Duration</p><p className="font-semibold">{detailView.totalDays} day{detailView.totalDays !== 1 ? "s" : ""}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">From</p><p className="font-semibold">{detailView.startDate}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">To</p><p className="font-semibold">{detailView.endDate}</p></div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-[10px] text-muted-foreground mb-1">Reason</p><p className="text-sm whitespace-pre-wrap">{detailView.reason}</p></div>
            {detailView.rejectionReason && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-100"><p className="text-[10px] text-red-500 mb-1">Rejection Reason</p><p className="text-sm text-red-700 whitespace-pre-wrap">{detailView.rejectionReason}</p></div>
            )}
            {(detailView.user?.ilLeaveEntitlement != null) && (
              <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Employee Leave Balance</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center"><p className="text-blue-600 font-bold text-sm">{detailView.user.ilLeaveEntitlement - (detailView.user.ilLeaveUsed || 0)}</p><p className="text-[10px] text-muted-foreground">IL Left</p></div>
                  <div className="text-center"><p className="text-amber-600 font-bold text-sm">{detailView.user.sickLeaveEntitlement - (detailView.user.sickLeaveUsed || 0)}</p><p className="text-[10px] text-muted-foreground">Sick Left</p></div>
                  <div className="text-center"><p className="text-purple-600 font-bold text-sm">{detailView.user.specialLeaveEntitlement - (detailView.user.specialLeaveUsed || 0)}</p><p className="text-[10px] text-muted-foreground">Special Left</p></div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Leave Modal */}
      <Modal
        open={!!editLeave}
        onClose={() => { setEditLeave(null); setEditForm(null); }}
        title="Edit Leave Request"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditLeave(null); setEditForm(null); }}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? "Saving…" : "Save Changes"}
            </Button>
          </>
        }
      >
        {editForm && (
          <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Leave Type</label>
              <Select value={editForm.leaveType} onChange={(e) => setEditForm({ ...editForm, leaveType: e.target.value })} required>
                <option value="IL">IL (Informed Leave)</option>
                <option value="SICK">Sick Leave</option>
                <option value="SPECIAL">Special Leave</option>
                <option value="UNPAID">Unpaid</option>
                <option value="EMERGENCY">Emergency</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
                <Input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
                <Input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Reason</label>
              <Textarea value={editForm.reason} onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })} rows={3} required />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAYROLL
   ═══════════════════════════════════════════ */
function PayrollView({ showToast }) {
  const [payrolls, setPayrolls] = useLocalState("ap-payrolls", []);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("");
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcPreview, setCalcPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [editPayroll, setEditPayroll] = useState(null);
  const [editPayrollLoading, setEditPayrollLoading] = useState(false);
  const [editPayrollForm, setEditPayrollForm] = useState({ taxDeduction: "", insuranceDeduction: "", otherDeductions: "", notes: "" });
  const editPayrollRef = useRef(null);
  const [calcForm, setCalcForm] = useState({
    userId: "", fullTimeWorkHours: "", taxDeduction: "0", insuranceDeduction: "0", otherDeductions: "0",
    payPeriodStart: new Date().toISOString().slice(0, 7) + "-01",
    payPeriodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10),
  });

  const load = useCallback(() => {
    setLoading(true);
    adminService.getPayrolls()
      .then((r) => setPayrolls(r.data.content || r.data))
      .catch((e) => { console.error("[Payroll] API load failed:", e); showToast("Failed to load payroll records", "error"); })
      .finally(() => setLoading(false));
  }, [setPayrolls, showToast]);

  useEffect(() => { load(); }, [load]);

  const filteredPayrolls = useMemo(() => {
    if (!filterUser.trim()) return payrolls;
    const q = filterUser.trim().toLowerCase();
    return payrolls.filter((pr) => {
      const u = pr.user || {};
      if (u.employeeId && String(u.employeeId) === q) return true;
      const name = ((u.firstName || "") + " " + (u.lastName || "")).toLowerCase();
      if (name.includes(q)) return true;
      if ((u.firstName || "").toLowerCase().includes(q)) return true;
      if ((u.lastName || "").toLowerCase().includes(q)) return true;
      return false;
    });
  }, [payrolls, filterUser]);

  const processRec = async (id) => {
    setActionLoading(id);
    try {
      await adminService.processPayroll(id);
      showToast("Payroll processed successfully", "success");
      load();
    } catch (err) {
      showToast("Failed to process: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const payRec = async (id) => {
    setActionLoading(id);
    try {
      await adminService.payPayroll(id);
      showToast("Payroll marked as paid", "success");
      load();
    } catch (err) {
      showToast("Failed to mark paid: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteRec = async (id) => {
    setDeleteConfirm(null);
    setActionLoading(id);
    try {
      await adminService.deletePayroll(id);
      showToast("Payroll record deleted", "success");
      load();
    } catch (err) {
      showToast("Failed to delete: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkProcess = async () => {
    setBulkLoading(true);
    try {
      await adminService.bulkProcess();
      showToast("Bulk payroll processed successfully", "success");
      load();
    } catch (err) {
      showToast("Bulk process failed: " + (err?.message || "Unknown error"), "error");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!calcForm.userId) { showToast("Employee ID is required", "warning"); return; }
    if (!calcForm.fullTimeWorkHours || Number(calcForm.fullTimeWorkHours) <= 0) { showToast("Full-time work hours is required", "warning"); return; }
    setCalcLoading(true);
    setCalcPreview(null);
    try {
      const res = await adminService.calculatePayroll({
        userId: Number(calcForm.userId),
        fullTimeWorkHours: Number(calcForm.fullTimeWorkHours),
        taxDeduction: Number(calcForm.taxDeduction) || 0,
        insuranceDeduction: Number(calcForm.insuranceDeduction) || 0,
        otherDeductions: Number(calcForm.otherDeductions) || 0,
        payPeriodStart: calcForm.payPeriodStart,
        payPeriodEnd: calcForm.payPeriodEnd,
      });
      setCalcPreview(res.data);
      showToast("Payroll calculated successfully", "success");
      load();
    } catch (err) {
      showToast("Calculation failed: " + (err?.message || "Unknown error"), "error");
    } finally {
      setCalcLoading(false);
    }
  };

  const openDetail = async (id) => {
    try {
      const r = await adminService.getPayroll(id);
      setDetailView(r.data);
    } catch (err) {
      showToast("Failed to load details", "error");
    }
  };

  const openEdit = (pr) => {
    setEditPayroll(pr);
    setEditPayrollForm({
      taxDeduction: pr.taxDeduction != null ? String(pr.taxDeduction) : "",
      insuranceDeduction: pr.insuranceDeduction != null ? String(pr.insuranceDeduction) : "",
      otherDeductions: pr.otherDeductions != null ? String(pr.otherDeductions) : "",
      notes: pr.notes || "",
    });
    setTimeout(() => {
      editPayrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditSubmit = async () => {
    if (!editPayroll) return;
    setEditPayrollLoading(true);
    try {
      await adminService.updatePayroll(editPayroll.id, {
        taxDeduction: Number(editPayrollForm.taxDeduction) || 0,
        insuranceDeduction: Number(editPayrollForm.insuranceDeduction) || 0,
        otherDeductions: Number(editPayrollForm.otherDeductions) || 0,
        notes: editPayrollForm.notes,
      });
      showToast("Payroll updated successfully", "success");
      setEditPayroll(null);
      load();
    } catch (err) {
      showToast("Failed to update: " + (err?.message || "Unknown error"), "error");
    } finally {
      setEditPayrollLoading(false);
    }
  };

  const calcField = (key, label, type = "number") => (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Input type={type} value={calcForm[key]} onChange={(e) => { setCalcForm({ ...calcForm, [key]: e.target.value }); setCalcPreview(null); }} />
    </div>
  );

  if (loading) return <PayrollSkeleton />;

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0.08} delay={0}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Payroll System</h2>
          <div className="flex gap-2">
            <Button onClick={load} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
            <Button onClick={() => setCalcOpen(true)} size="sm"><Icon name="plus" size={14} /> Calculate</Button>
            <Button onClick={handleBulkProcess} variant="outline" size="sm" disabled={bulkLoading}>
              <Icon name="clock" size={14} /> {bulkLoading ? "Processing…" : "Bulk Process"}
            </Button>
          </div>
        </div>
      </ScrollReveal>
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.15}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Payroll Records ({filteredPayrolls.length})</CardTitle>
            <div className="relative w-56">
              <span className="pointer-events-none absolute left-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground">
                <Icon name="search" size={13} />
              </span>
              <Input
                placeholder="Search by ID or name…"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="h-8 w-full pl-8 pr-6 text-xs"
              />
              {filterUser && (
                <button onClick={() => setFilterUser("")} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!filteredPayrolls.length ? <p className="py-8 text-center text-muted-foreground">{filterUser ? "No matching payroll records." : "No payroll records."}</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Period</TableHead><TableHead>Base</TableHead><TableHead>OT</TableHead><TableHead>Extra</TableHead><TableHead>IL Payout</TableHead><TableHead>Deductions</TableHead><TableHead>Gross</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredPayrolls.map((pr) => (
                  <TableRow key={pr.id} style={actionLoading === pr.id ? { opacity: 0.6 } : undefined}>
                    <TableCell className="font-medium">{(pr.user || {}).firstName} {(pr.user || {}).lastName}</TableCell>
                    <TableCell>{pr.payPeriodStart}<br />{pr.payPeriodEnd}</TableCell>
                    <TableCell>${pr.baseSalary}</TableCell><TableCell>${pr.overtimePay || 0}</TableCell><TableCell>${pr.extraSalary || 0}</TableCell><TableCell>{pr.ilPayout ? <span className="text-purple-600 font-semibold">${pr.ilPayout}</span> : "—"}</TableCell><TableCell>${pr.totalDeductions}</TableCell>
                    <TableCell className="font-semibold">${pr.grossSalary}</TableCell><TableCell className="font-semibold text-emerald-600">${pr.netSalary}</TableCell>
                    <TableCell><Badge variant={pr.status === "PAID" ? "success" : pr.status === "PROCESSED" ? "warning" : "default"}>{pr.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {pr.status === "DRAFT" && <button onClick={() => processRec(pr.id)} title="Process" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="clock" size={14} /></button>}
                        {pr.status === "PROCESSED" && <button onClick={() => payRec(pr.id)} title="Mark Paid" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"><Icon name="check" size={14} /></button>}
                        <button onClick={() => openEdit(pr)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer"><Icon name="edit" size={14} /></button>
                        <button onClick={() => openDetail(pr.id)} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                        <button onClick={() => setDeleteConfirm(pr.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="trash" size={14} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </ScrollReveal>

      {/* Calculate Payroll Modal */}
      <Modal
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        title="Calculate Payroll"
        footer={
          <>
            <Button variant="outline" onClick={() => setCalcOpen(false)}>Cancel</Button>
            <Button onClick={handleCalculate} disabled={calcLoading}>
              {calcLoading ? "Calculating…" : "Calculate"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {calcField("userId", "Employee ID", "number")}
            {calcField("fullTimeWorkHours", "Full-Time Work Hours")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {calcField("payPeriodStart", "Period Start", "date")}
            {calcField("payPeriodEnd", "Period End", "date")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {calcField("taxDeduction", "Tax ($)")}
            {calcField("insuranceDeduction", "Insurance ($)")}
            {calcField("otherDeductions", "Other Deductions ($)")}
          </div>
          {calcPreview && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
              <h4 className="font-semibold text-sm">Calculation Result</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Base Salary</p>
                  <p className="font-semibold">${calcPreview.baseSalary}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Full-Time Hours</p>
                  <p className="font-semibold">{calcPreview.fullTimeWorkHours}h</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Actual Work Hours</p>
                  <p className="font-semibold">{calcPreview.actualWorkHours}h</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Overtime Hours</p>
                  <p className="font-semibold">{calcPreview.overtimeHours}h</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Extra Salary</p>
                  <p className="font-semibold text-blue-600">${calcPreview.extraSalary}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Overtime Pay</p>
                  <p className="font-semibold text-blue-600">${calcPreview.overtimePay}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">IL Payout</p>
                  <p className="font-semibold text-purple-600">${calcPreview.ilPayout || 0}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Late Deduction</p>
                  <p className="font-semibold text-orange-600">${calcPreview.lateDeduction || 0} <span className="text-[10px] font-normal">({calcPreview.lateMinutes || 0} min late)</span></p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Gross Salary</p>
                  <p className="font-semibold">${calcPreview.grossSalary}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-gray-100">
                  <p className="text-[10px] text-muted-foreground">Total Deductions</p>
                  <p className="font-semibold text-red-600">${calcPreview.totalDeductions}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-200 col-span-2">
                  <p className="text-[10px] text-emerald-600">Net Salary</p>
                  <p className="text-lg font-bold text-emerald-700">${calcPreview.netSalary}</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Extra = (base ÷ fullTime) × (actual — fullTime) &nbsp;|&nbsp; OT Pay = hourly × OT hours × 1.5
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Payroll Record"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button onClick={() => deleteRec(deleteConfirm)} variant="destructive">Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Are you sure you want to delete this payroll record? This action cannot be undone.</p>
      </Modal>

      {/* Detail View Modal */}
      <Modal
        open={!!detailView}
        onClose={() => setDetailView(null)}
        title="Payroll Details"
        footer={
          <Button variant="outline" onClick={() => setDetailView(null)}>Close</Button>
        }
      >
        {detailView && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Employee</p><p className="font-semibold">{(detailView.user || {}).firstName} {(detailView.user || {}).lastName}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Status</p><Badge variant={detailView.status === "PAID" ? "success" : detailView.status === "PROCESSED" ? "warning" : "default"}>{detailView.status}</Badge></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Period</p><p className="font-semibold">{detailView.payPeriodStart} — {detailView.payPeriodEnd}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Base Salary</p><p className="font-semibold">${detailView.baseSalary}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Full-Time Hours</p><p className="font-semibold">{detailView.fullTimeWorkHours}h</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Actual Hours</p><p className="font-semibold">{detailView.actualWorkHours}h</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Overtime</p><p className="font-semibold">{detailView.overtimeHours}h — ${detailView.overtimePay}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Extra Salary</p><p className="font-semibold text-blue-600">${detailView.extraSalary}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">IL Payout</p><p className="font-semibold text-purple-600">${detailView.ilPayout || 0}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Late</p><p className="font-semibold text-orange-600">{detailView.lateMinutes || 0} min — ${detailView.lateDeduction || 0}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Tax</p><p className="font-semibold">${detailView.taxDeduction}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Insurance</p><p className="font-semibold">${detailView.insuranceDeduction}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Other Deductions</p><p className="font-semibold">${detailView.otherDeductions}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Gross Salary</p><p className="font-semibold">${detailView.grossSalary}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Total Deductions</p><p className="font-semibold text-red-600">${detailView.totalDeductions}</p></div>
              <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-200 col-span-2"><p className="text-[10px] text-emerald-600">Net Salary</p><p className="text-lg font-bold text-emerald-700">${detailView.netSalary}</p></div>
              {detailView.paymentDate && <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Payment Date</p><p className="font-semibold">{detailView.paymentDate}</p></div>}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Payroll Modal */}
      <Modal
        open={!!editPayroll}
        onClose={() => setEditPayroll(null)}
        title={editPayroll ? `Edit Payroll — ${(editPayroll.user || {}).firstName} ${(editPayroll.user || {}).lastName}` : "Edit Payroll"}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditPayroll(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={editPayrollLoading}>
              {editPayrollLoading ? "Saving…" : "Save Changes"}
            </Button>
          </>
        }
      >
        {editPayroll && (
          <div ref={editPayrollRef} className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Read-Only Summary</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">Period:</span> <span className="font-medium">{editPayroll.payPeriodStart} — {editPayroll.payPeriodEnd}</span></div>
                <div><span className="text-muted-foreground">Base Salary:</span> <span className="font-medium">${editPayroll.baseSalary}</span></div>
                <div><span className="text-muted-foreground">Gross:</span> <span className="font-medium">${editPayroll.grossSalary}</span></div>
                <div><span className="text-muted-foreground">OT Pay:</span> <span className="font-medium">${editPayroll.overtimePay || 0}</span></div>
                <div><span className="text-muted-foreground">Extra:</span> <span className="font-medium">${editPayroll.extraSalary || 0}</span></div>
                <div><span className="text-muted-foreground">IL Payout:</span> <span className="font-medium text-purple-600">${editPayroll.ilPayout || 0}</span></div>
                <div><span className="text-muted-foreground">Late Ded.:</span> <span className="font-medium text-orange-600">${editPayroll.lateDeduction || 0}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Editable Fields</h4>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tax Deduction ($)</label>
                <Input type="number" value={editPayrollForm.taxDeduction} onChange={(e) => setEditPayrollForm({ ...editPayrollForm, taxDeduction: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Insurance Deduction ($)</label>
                <Input type="number" value={editPayrollForm.insuranceDeduction} onChange={(e) => setEditPayrollForm({ ...editPayrollForm, insuranceDeduction: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Other Deductions ($)</label>
                <Input type="number" value={editPayrollForm.otherDeductions} onChange={(e) => setEditPayrollForm({ ...editPayrollForm, otherDeductions: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes</label>
                <textarea className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" rows={3} value={editPayrollForm.notes} onChange={(e) => setEditPayrollForm({ ...editPayrollForm, notes: e.target.value })} placeholder="Add notes..." />
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
              <strong>Note:</strong> Changing deductions will automatically recalculate gross, total deductions, and net salary.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PERFORMANCE REVIEWS
   ═══════════════════════════════════════════ */
function PerformanceView({ showToast }) {
  const [reviews, setReviews] = useLocalState("apr-reviews", []);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("");
  const [perfOpen, setPerfOpen] = useState(false);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfResult, setPerfResult] = useState(null);
  const [perfError, setPerfError] = useState("");
  const [perfEmployeeId, setPerfEmployeeId] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [empIds, setEmpIds] = useState([{ id: 1, value: "" }]);
  const nextIdRef = useRef(2);
  const editFormRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    adminService.getReviews()
      .then((r) => setReviews(r.data.content || r.data))
      .catch((e) => { console.error("[Performance] API load failed:", e); showToast("Failed to load reviews", "error"); })
      .finally(() => setLoading(false));
  }, [setReviews, showToast]);

  useEffect(() => { load(); }, [load]);

  const filteredReviews = useMemo(() => {
    if (!filterUser.trim()) return reviews;
    const q = filterUser.trim().toLowerCase();
    return reviews.filter((rw) => {
      const emp = rw.employee || {};
      if (emp.employeeId && String(emp.employeeId) === q) return true;
      const name = ((emp.firstName || "") + " " + (emp.lastName || "")).toLowerCase();
      if (name.includes(q)) return true;
      if ((emp.firstName || "").toLowerCase().includes(q)) return true;
      if ((emp.lastName || "").toLowerCase().includes(q)) return true;
      return false;
    });
  }, [reviews, filterUser]);

  const del = async (id) => {
    setDeleteConfirm(null);
    setActionLoading(id);
    try {
      await adminService.deleteReview(id);
      showToast("Review deleted", "success");
      load();
    } catch (err) {
      showToast("Failed to delete: " + (err?.message || "Unknown error"), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const openDetail = async (id) => {
    try {
      const r = await adminService.getReview(id);
      setDetailView(r.data);
    } catch (err) {
      showToast("Failed to load details", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const ids = empIds.map((e) => Number(e.value)).filter(Boolean);
    if (!ids.length) { showToast("At least one employee ID is required", "warning"); return; }
    setSubmitLoading(true);
    try {
      const reviewData = {
        reviewPeriodStart: f.periodStart.value, reviewPeriodEnd: f.periodEnd.value,
        qualityScore: Number(f.quality.value), productivityScore: Number(f.productivity.value),
        communicationScore: Number(f.communication.value), teamworkScore: Number(f.teamwork.value),
        punctualityScore: Number(f.punctuality.value), feedback: f.feedback.value, goals: f.goals.value,
      };
      const promises = ids.map((id) => adminService.createReview({ employeeId: id, ...reviewData }));
      await Promise.all(promises);
      showToast(`Review${ids.length > 1 ? "s" : ""} submitted successfully`, "success");
      setEmpIds([{ id: 1, value: "" }]);
      nextIdRef.current = 2;
      f.reset();
      load();
    } catch (err) {
      showToast("Failed to submit: " + (err?.message || "Unknown error"), "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEdit = (rw) => {
    setEditReview(rw);
    setEditForm({
      reviewPeriodStart: rw.reviewPeriodStart || "",
      reviewPeriodEnd: rw.reviewPeriodEnd || "",
      qualityScore: rw.qualityScore || 1,
      productivityScore: rw.productivityScore || 1,
      communicationScore: rw.communicationScore || 1,
      teamworkScore: rw.teamworkScore || 1,
      punctualityScore: rw.punctualityScore || 1,
      feedback: rw.feedback || "",
      goals: rw.goals || "",
    });
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editReview || !editForm) return;
    setEditLoading(true);
    try {
      await adminService.updateReview(editReview.id, {
        reviewPeriodStart: editForm.reviewPeriodStart,
        reviewPeriodEnd: editForm.reviewPeriodEnd,
        qualityScore: Number(editForm.qualityScore),
        productivityScore: Number(editForm.productivityScore),
        communicationScore: Number(editForm.communicationScore),
        teamworkScore: Number(editForm.teamworkScore),
        punctualityScore: Number(editForm.punctualityScore),
        feedback: editForm.feedback,
        goals: editForm.goals,
      });
      showToast("Review updated successfully", "success");
      setEditReview(null);
      setEditForm(null);
      load();
    } catch (err) {
      showToast("Failed to update: " + (err?.message || "Unknown error"), "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEmployeePerformance = async () => {
    if (!perfEmployeeId) { setPerfError("Employee ID is required"); return; }
    setPerfLoading(true);
    setPerfError("");
    setPerfResult(null);
    try {
      const res = await adminService.getEmployeePerformance(Number(perfEmployeeId));
      const data = res.data;
      const result = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : data);
      setPerfResult(result);
    } catch (err) {
      setPerfError(err?.message || "Failed to fetch performance data");
    } finally {
      setPerfLoading(false);
    }
  };

  const handleBulkProcess = async () => {
    setBulkLoading(true);
    setBulkResult(null);
    try {
      const res = await adminService.bulkProcess();
      setBulkResult({ success: true, message: "Bulk payroll processed successfully", data: res.data });
      showToast("Bulk payroll processed successfully", "success");
      load();
    } catch (err) {
      setBulkResult({ success: false, message: err?.response?.data?.message || err?.message || "Bulk process failed" });
      showToast("Bulk process failed: " + (err?.message || "Unknown error"), "error");
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) return <PerformanceSkeleton />;

  return (
    <div className="space-y-7">
      <ScrollReveal variant="fadeUp" stagger={0} delay={0}>
        <h2 className="text-2xl font-bold">Performance Reviews</h2>
      </ScrollReveal>
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.15}>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Icon name="plus" size={16} className="text-primary" /> Submit Review</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-primary flex items-center gap-1.5"><Icon name="users" size={14} /> Employee(s)</p>
                {empIds.length < 5 && (
                  <button type="button" onClick={() => { setEmpIds([...empIds, { id: nextIdRef.current, value: "" }]); nextIdRef.current += 1; }} className="flex h-7 items-center gap-1 rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer">
                    <Icon name="plus" size={12} /> Add
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {empIds.map((emp, idx) => (
                  <div key={emp.id} className="flex items-center gap-2">
                    <span className="w-5 text-center text-[10px] font-bold text-muted-foreground">{idx + 1}</span>
                    <Input type="number" min={1} value={emp.value} onChange={(e) => { const updated = [...empIds]; updated[idx].value = e.target.value; setEmpIds(updated); }} placeholder={`Employee ID ${idx + 1}`} required={idx === 0} className="flex-1" />
                    {empIds.length > 1 && (
                      <button type="button" onClick={() => setEmpIds(empIds.filter((e) => e.id !== emp.id))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer">
                        <Icon name="x" size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {[
                { n: "periodStart", l: "Period Start", type: "date" }, { n: "periodEnd", l: "Period End", type: "date" },
                { n: "quality", l: "Quality (1-5)", type: "number" }, { n: "productivity", l: "Productivity (1-5)", type: "number" }, { n: "communication", l: "Communication (1-5)", type: "number" },
                { n: "teamwork", l: "Teamwork (1-5)", type: "number" }, { n: "punctuality", l: "Punctuality (1-5)", type: "number" },
              ].map(({ n, l, type = "text" }) => (
                <div key={n}><label className="mb-1 block text-xs font-medium text-muted-foreground">{l}</label><Input name={n} type={type} min={type === "number" ? 1 : null} max={type === "number" ? 5 : null} required /></div>
              ))}
            </div>
            <div className="mt-4"><label className="mb-1 block text-xs font-medium text-muted-foreground">Feedback</label><Textarea name="feedback" rows="3" required /></div>
            <div className="mt-4"><label className="mb-1 block text-xs font-medium text-muted-foreground">Goals / Areas of Improvement</label><Textarea name="goals" rows="2" /></div>
            <Button type="submit" className="mt-4" disabled={submitLoading}><Icon name="check" size={14} /> {submitLoading ? "Submitting…" : "Submit Review"}</Button>
          </form>
        </CardContent>
      </Card>
      </ScrollReveal>
      <ScrollReveal variant="fadeUp" stagger={0.08} delay={0.3}>
        <div className="flex gap-2">
          <Button onClick={load} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
          <Button onClick={() => { setPerfOpen(true); setPerfResult(null); setPerfError(""); setPerfEmployeeId(""); }} variant="outline" size="sm"><Icon name="users" size={14} /> Employee Performance</Button>
          <Button onClick={() => { setBulkOpen(true); setBulkResult(null); }} variant="outline" size="sm" disabled={bulkLoading}><Icon name="clock" size={14} /> Bulk Process</Button>
        </div>
      </ScrollReveal>
      <ScrollReveal variant="fadeUp" stagger={0.06} delay={0.45}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">All Reviews ({filteredReviews.length})</CardTitle>
            <div className="relative w-56">
              <span className="pointer-events-none absolute left-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground">
                <Icon name="search" size={13} />
              </span>
              <Input
                placeholder="Search by ID or name…"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="h-8 w-full pl-8 pr-6 text-xs"
              />
              {filterUser && (
                <button onClick={() => setFilterUser("")} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!filteredReviews.length ? <p className="py-8 text-center text-muted-foreground">{filterUser ? "No matching reviews." : "No reviews yet."}</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Period</TableHead><TableHead>Quality</TableHead><TableHead>Productivity</TableHead><TableHead>Overall</TableHead><TableHead>Goals</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredReviews.map((rw) => (
                  <TableRow key={rw.id} style={actionLoading === rw.id ? { opacity: 0.6 } : undefined}>
                    <TableCell className="font-medium">{(rw.employee || {}).firstName} {(rw.employee || {}).lastName}</TableCell>
                    <TableCell>{rw.reviewPeriodStart} — {rw.reviewPeriodEnd}</TableCell>
                    <TableCell>{rw.qualityScore}/5</TableCell><TableCell>{rw.productivityScore}/5</TableCell>
                    <TableCell className="font-bold text-primary">{rw.overallScore}/5</TableCell>
                    <TableCell className="max-w-[200px] truncate">{rw.goals}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(rw.id)} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                        <button onClick={() => openEdit(rw)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer"><Icon name="edit" size={14} /></button>
                        <button onClick={() => setDeleteConfirm(rw.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="trash" size={14} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </ScrollReveal>

      {/* Employee Performance Modal */}
      <Modal
        open={perfOpen}
        onClose={() => setPerfOpen(false)}
        title="Employee Performance"
        footer={
          <>
            <Button variant="outline" onClick={() => setPerfOpen(false)}>Close</Button>
            <Button onClick={handleEmployeePerformance} disabled={perfLoading}>
              {perfLoading ? "Loading…" : "Fetch"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
            <Input type="number" value={perfEmployeeId} onChange={(e) => setPerfEmployeeId(e.target.value)} placeholder="Enter employee ID" />
          </div>
          {perfError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <Icon name="alert" size={16} />
              {perfError}
            </div>
          )}
          {perfResult && (
            <div className="space-y-3">
              {Array.isArray(perfResult) && perfResult.length > 0 ? (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Productivity</TableHead>
                        <TableHead>Teamwork</TableHead>
                        <TableHead>Overall</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {perfResult.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-xs">{r.reviewPeriodStart} — {r.reviewPeriodEnd}</TableCell>
                          <TableCell>{r.qualityScore ?? "—"}/5</TableCell>
                          <TableCell>{r.productivityScore ?? "—"}/5</TableCell>
                          <TableCell>{r.teamworkScore ?? "—"}/5</TableCell>
                          <TableCell className="font-bold text-primary">{r.overallScore ?? "—"}/5</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-muted-foreground">No performance reviews found for this employee.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Review"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button onClick={() => del(deleteConfirm)} variant="destructive">Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Are you sure you want to delete this performance review? This action cannot be undone.</p>
      </Modal>

      {/* Edit Review Modal */}
      <Modal
        open={!!editReview}
        onClose={() => { setEditReview(null); setEditForm(null); }}
        title="Edit Performance Review"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditReview(null); setEditForm(null); }}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? "Saving…" : "Save Changes"}
            </Button>
          </>
        }
      >
        {editForm && (
          <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Period Start</label>
                <Input type="date" value={editForm.reviewPeriodStart} onChange={(e) => setEditForm({ ...editForm, reviewPeriodStart: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Period End</label>
                <Input type="date" value={editForm.reviewPeriodEnd} onChange={(e) => setEditForm({ ...editForm, reviewPeriodEnd: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Quality (1-5)</label>
                <Input type="number" min={1} max={5} value={editForm.qualityScore} onChange={(e) => setEditForm({ ...editForm, qualityScore: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Productivity (1-5)</label>
                <Input type="number" min={1} max={5} value={editForm.productivityScore} onChange={(e) => setEditForm({ ...editForm, productivityScore: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Communication (1-5)</label>
                <Input type="number" min={1} max={5} value={editForm.communicationScore} onChange={(e) => setEditForm({ ...editForm, communicationScore: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Teamwork (1-5)</label>
                <Input type="number" min={1} max={5} value={editForm.teamworkScore} onChange={(e) => setEditForm({ ...editForm, teamworkScore: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Punctuality (1-5)</label>
                <Input type="number" min={1} max={5} value={editForm.punctualityScore} onChange={(e) => setEditForm({ ...editForm, punctualityScore: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Feedback</label>
              <Textarea value={editForm.feedback} onChange={(e) => setEditForm({ ...editForm, feedback: e.target.value })} rows={3} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Goals / Areas of Improvement</label>
              <Textarea value={editForm.goals} onChange={(e) => setEditForm({ ...editForm, goals: e.target.value })} rows={2} />
            </div>
          </form>
        )}
      </Modal>

      {/* Detail View Modal */}
      <Modal
        open={!!detailView}
        onClose={() => setDetailView(null)}
        title="Review Details"
        footer={
          <Button variant="outline" onClick={() => setDetailView(null)}>Close</Button>
        }
      >
        {detailView && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Employee</p><p className="font-semibold">{(detailView.employee || {}).firstName} {(detailView.employee || {}).lastName}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Period</p><p className="font-semibold">{detailView.reviewPeriodStart} — {detailView.reviewPeriodEnd}</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Quality</p><p className="font-semibold">{detailView.qualityScore}/5</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Productivity</p><p className="font-semibold">{detailView.productivityScore}/5</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Communication</p><p className="font-semibold">{detailView.communicationScore}/5</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Teamwork</p><p className="font-semibold">{detailView.teamworkScore}/5</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-[10px] text-muted-foreground">Punctuality</p><p className="font-semibold">{detailView.punctualityScore}/5</p></div>
              <div className="rounded-lg bg-primary/5 p-2"><p className="text-[10px] text-primary">Overall Score</p><p className="font-bold text-primary text-lg">{detailView.overallScore}/5</p></div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-[10px] text-muted-foreground mb-1">Feedback</p><p className="text-sm whitespace-pre-wrap">{detailView.feedback}</p></div>
            {detailView.goals && <div className="rounded-lg bg-gray-50 p-3"><p className="text-[10px] text-muted-foreground mb-1">Goals / Areas of Improvement</p><p className="text-sm whitespace-pre-wrap">{detailView.goals}</p></div>}
          </div>
        )}
      </Modal>

      {/* Bulk Process Modal */}
      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Process Payroll"
        footer={
          <>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            {!bulkResult && (
              <Button onClick={handleBulkProcess} disabled={bulkLoading}>
                {bulkLoading ? "Processing…" : "Confirm"}
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-4">
          {!bulkResult && !bulkLoading && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Icon name="alert" size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Process all draft payrolls?</p>
                <p className="mt-1 text-amber-700">This will process all pending payroll records in bulk. This action cannot be undone.</p>
              </div>
            </div>
          )}
          {bulkLoading && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <Icon name="clock" size={18} className="shrink-0 animate-spin" />
              <p className="font-medium">Processing bulk payroll… Please wait.</p>
            </div>
          )}
          {bulkResult && (
            <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${bulkResult.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
              <Icon name={bulkResult.success ? "check" : "alert"} size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{bulkResult.success ? "Success" : "Failed"}</p>
                <p className="mt-1">{bulkResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
