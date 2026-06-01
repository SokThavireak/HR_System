import React, { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import AttendancePage from "./AttendancePage";
import { ShaderAnimation } from "../components/ui/shader-animation";
import {
  Button, Input, Select, Textarea,
  Card, CardHeader, CardTitle, CardContent,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  LoadingSkeleton,
} from "../components/ui";

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

/* ─── localStorage-backed useState ─── */
function useLocalState(key, initial) {
  const [v, setV] = React.useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
    return initial;
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }, [key, v]);
  return [v, setV];
}

/* ─── Stat Card ─── */
function StatCard({ bg, value, label, iconName }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: bg }}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: bg }}>
        <Icon name={iconName} size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}


export default function AdminDashboard({ user }) {
  const [section, setSection] = useState("dashboard");

  return (
    <div className="min-h-screen" style={{ background: "#efe6dd" }}>

      {/* ═══ SHADER BACKGROUND — body only ═══ */}
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
          <nav className="flex flex-1 flex-col gap-1 px-3">
            {SIDEBAR_ITEMS.map((item, idx) => {
              const isActive = section === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`animate-sidebar-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium cursor-pointer transition-all ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    animationDelay: `${0.15 + idx * 0.06}s`,
                    ...(isActive ? { background: "rgba(255,255,255,0.15)" } : {})
                  }}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${isActive ? "bg-white/20" : ""}`}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
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
              onClick={() => { localStorage.removeItem("hrms_token"); window.location.reload(); }}
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
      <div className="relative z-10 ml-[260px] flex flex-1 flex-col" style={{ background: "transparent" }}>

        {/* Top Bar — no background */}
        <header className="sticky top-0 z-50 flex h-32 items-center justify-between px-8 border-b border-gray-200/50 animate-header-slide" style={{ background: "transparent" }}>
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
          <div className="flex items-center gap-4 animate-header-right">
            <time className="text-sm text-muted-foreground animate-header-time">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>
        </header>

        <main className="flex-1 p-6" style={{ background: "transparent" }}>
          {section === "dashboard" && <DashboardView user={user} />}
          {section === "users" && <UserManagementView />}
          {section === "categories" && <CategoryView />}
          {section === "attendance" && <AttendancePage />}
          {section === "leaves" && <LeaveApprovalsView />}
          {section === "payroll" && <PayrollView />}
          {section === "performance" && <PerformanceView />}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEPARTMENT & POSITION MANAGEMENT
   ═══════════════════════════════════════════ */
function CategoryView() {
  const [departments, setDepartments] = useLocalState("cat-departments", []);
  const [positions, setPositions] = useLocalState("cat-positions", []);
  const [activeTab, setActiveTab] = useState("departments");

  // Department form
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  const [editDeptId, setEditDeptId] = useState(null);

  // Position form
  const [posForm, setPosForm] = useState({ title: "", description: "", department: "" });
  const [editPosId, setEditPosId] = useState(null);

  // Department CRUD
  const saveDept = (e) => {
    e.preventDefault();
    if (editDeptId !== null) {
      setDepartments(departments.map((d) => (d.id === editDeptId ? { ...d, ...deptForm } : d)));
      setEditDeptId(null);
    } else {
      setDepartments([...departments, { id: Date.now(), ...deptForm }]);
    }
    setDeptForm({ name: "", description: "" });
  };

  const deleteDept = (id) => {
    if (confirm("Delete this department?")) {
      setDepartments(departments.filter((d) => d.id !== id));
      setPositions(positions.filter((p) => p.department !== departments.find((d) => d.id === id)?.name));
    }
  };

  const startEditDept = (dept) => {
    setEditDeptId(dept.id);
    setDeptForm({ name: dept.name, description: dept.description });
  };

  // Position CRUD
  const savePos = (e) => {
    e.preventDefault();
    if (editPosId !== null) {
      setPositions(positions.map((p) => (p.id === editPosId ? { ...p, ...posForm } : p)));
      setEditPosId(null);
    } else {
      setPositions([...positions, { id: Date.now(), ...posForm }]);
    }
    setPosForm({ title: "", description: "", department: "" });
  };

  const deletePos = (id) => {
    if (confirm("Delete this position?")) {
      setPositions(positions.filter((p) => p.id !== id));
    }
  };

  const startEditPos = (pos) => {
    setEditPosId(pos.id);
    setPosForm({ title: pos.title, description: pos.description, department: pos.department });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Department & Position</h2>
        <p className="text-sm text-muted-foreground">Manage departments and job positions across the organization.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#9a0002" }}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "#9a0002" }}>
            <Icon name="folder" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{departments.length}</p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">Total Departments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "#3b82f6" }}>
            <Icon name="briefcase" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{positions.length}</p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">Total Positions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "departments" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon name="folder" size={14} className="mr-1.5 inline-block" /> Departments
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "positions" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon name="briefcase" size={14} className="mr-1.5 inline-block" /> Positions
        </button>
      </div>

      {/* ═══ DEPARTMENTS TAB ═══ */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon name="plus" size={16} className="text-primary" />
                {editDeptId !== null ? "Edit Department" : "Add New Department"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveDept} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <Card>
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
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon name="plus" size={16} className="text-primary" />
                {editPosId !== null ? "Edit Position" : "Add New Position"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePos} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Position Title</label>
                    <Input value={posForm.title} onChange={(e) => setPosForm({ ...posForm, title: e.target.value })} placeholder="e.g. Software Engineer" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                    <Select value={posForm.department} onChange={(e) => setPosForm({ ...posForm, department: e.target.value })} required>
                      <option value="">Select department...</option>
                      {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
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
                    <Button type="button" variant="outline" onClick={() => { setEditPosId(null); setPosForm({ title: "", description: "", department: "" }); }}>Cancel</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
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
                      <TableRow key={pos.id}>
                        <TableCell className="font-medium">{pos.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pos.department}</Badge>
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
   DASHBOARD OVERVIEW
   ═══════════════════════════════════════════ */
function DashboardView({ user }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminService.getDashboardStats().then((r) => setStats(r.data)).catch(() => {}); }, []);

  const cards = stats
    ? [
        { label: "Total Employees", value: stats.totalEmployees, bg: "#9a0002", iconName: "users" },
        { label: "Attendance Rate", value: `${stats.attendanceRate}%`, bg: "#22c55e", iconName: "check" },
        { label: "Pending Leaves", value: stats.pendingLeaves, bg: "#f59e0b", iconName: "clock" },
        { label: "Monthly Payroll", value: `$${stats.totalPayroll}`, bg: "#ef4444", iconName: "dollar" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName || "Admin"}! Here's your dashboard summary.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { text: "New employee John Doe added to Engineering", time: "2 min ago", bg: "#7A6BFF" },
              { text: "Leave request from Jane Smith approved", time: "15 min ago", bg: "#22c55e" },
              { text: "Payroll for March processed", time: "1 hour ago", bg: "#f59e0b" },
              { text: "Performance review submitted for Alice Johnson", time: "3 hours ago", bg: "#3b82f6" },
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
    </div>
  );
}

/* ═══════════════════════════════════════════
   USER MANAGEMENT
   ═══════════════════════════════════════════ */
function UserManagementView() {
  const [users, setUsers] = useLocalState("am-users", []);
  const [search, setSearch] = useLocalState("am-search", "");
  const [form, setForm] = useLocalState("am-form", { firstName: "", lastName: "", email: "", phone: "", department: "", position: "", baseSalary: "", hireDate: "", role: "ROLE_EMPLOYEE", password: "changeme" });
  const [loading, setLoading] = useLocalState("am-loading", false);
  const [editUserId, setEditUserId] = useState(null);
  const [departments] = useLocalState("cat-departments", []);
  const [positions] = useLocalState("cat-positions", []);

  const load = () => { setLoading(true); adminService.getUsers(search).then((r) => { setUsers(r.data.content || r.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  // Filter positions by selected department
  const filteredPositions = form.department
    ? positions.filter((p) => p.department === form.department)
    : positions;

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", email: "", phone: "", department: "", position: "", baseSalary: "", hireDate: "", role: "ROLE_EMPLOYEE", password: "changeme" });
    setEditUserId(null);
  };

  const create = async (e) => {
    e.preventDefault();
    await adminService.createUser(form);
    resetForm();
    load();
  };

  const startEdit = (u) => {
    setEditUserId(u.id);
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      phone: u.phone || "",
      department: u.department || "",
      position: u.position || "",
      baseSalary: u.baseSalary || "",
      hireDate: u.hireDate || "",
      role: (u.roles || []).some((r) => r.name === "ROLE_HR_ADMIN") ? "ROLE_HR_ADMIN" : "ROLE_EMPLOYEE",
      password: "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await adminService.updateUser(editUserId, form);
    resetForm();
    load();
  };

  const deactivate = async (u) => { if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) { await adminService.deactivateUser(u.id); load(); } };
  const activate = async (u) => { await adminService.activateUser(u.id); load(); };
  const resetPwd = async (u) => { const pw = prompt("New password:"); if (pw) await adminService.resetPassword(u.id, pw); };
  const remove = async (u) => { if (confirm(`Permanently delete ${u.firstName} ${u.lastName}?`)) { await adminService.deleteUser(u.id); load(); } };

  const TEXT_FIELDS = [
    { k: "firstName", l: "First Name" },
    { k: "lastName", l: "Last Name" },
    { k: "email", l: "Email", type: "email" },
    { k: "phone", l: "Phone" },
    { k: "baseSalary", l: "Base Salary ($)", type: "number" },
    { k: "hireDate", l: "Hire Date", type: "date" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-sm text-muted-foreground">Manage employees, assign departments & positions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#9a0002" }}>
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs font-medium text-muted-foreground">Total Users</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#10b981" }}>
          <p className="text-2xl font-bold">{users.filter((u) => u.active).length}</p>
          <p className="text-xs font-medium text-muted-foreground">Active</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#6b7280" }}>
          <p className="text-2xl font-bold">{users.filter((u) => !u.active).length}</p>
          <p className="text-xs font-medium text-muted-foreground">Inactive</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}>
          <p className="text-2xl font-bold">{departments.length}</p>
          <p className="text-xs font-medium text-muted-foreground">Departments</p>
        </div>
      </div>

      {/* Add / Edit Form */}
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
          <form onSubmit={editUserId !== null ? saveEdit : create} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEXT_FIELDS.map(({ k, l, type = "text" }) => (
                <div key={k}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{l}</label>
                  <Input type={type} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required />
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

      {/* Search */}
      <div className="flex gap-3">
        <Input placeholder="Search name, email, dept…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={load} variant="outline"><Icon name="search" size={14} /> Search</Button>
        <Button onClick={load} variant="secondary"><Icon name="refresh" size={14} /> Refresh</Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Employees ({users.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading…</p>
          ) : !users.length ? (
            <p className="py-8 text-center text-muted-foreground">No employees found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[130px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isAdmin = (u.roles || []).some((r) => r.name === "ROLE_HR_ADMIN");
                  const saving = editUserId === u.id;
                  return (
                    <TableRow key={u.id} style={saving ? { background: "rgba(59,130,246,0.04)" } : undefined}>
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
    </div>
  );
}

/* ═══════════════════════════════════════════
   LEAVE APPROVALS
   ═══════════════════════════════════════════ */
function LeaveApprovalsView() {
  const [leaves, setLeaves] = useLocalState("al-leaves", []);
  const load = () => adminService.getLeaves("PENDING").then((r) => setLeaves(r.data.content || r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const approve = (id) => adminService.approveLeave(id).then(load);
  const reject = (id) => { const r = prompt("Reason:"); if (r) adminService.rejectLeave(id, r).then(load); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Leave Approvals</h2>
        <Button onClick={load} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Pending Requests ({leaves.length})</CardTitle></CardHeader>
        <CardContent>
          {!leaves.length ? <p className="py-8 text-center text-muted-foreground">No pending requests.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {leaves.map((lv) => (
                  <TableRow key={lv.id}>
                    <TableCell className="font-medium">{(lv.user || {}).firstName} {(lv.user || {}).lastName}</TableCell>
                    <TableCell>{lv.leaveType}</TableCell><TableCell>{lv.startDate}</TableCell><TableCell>{lv.endDate}</TableCell><TableCell>{lv.totalDays}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{lv.reason}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button onClick={() => approve(lv.id)} title="Approve" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"><Icon name="check" size={14} /></button>
                        <button onClick={() => reject(lv.id)} title="Reject" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="x" size={14} /></button>
                        <button onClick={() => adminService.getLeave(lv.id).then((r) => alert(JSON.stringify(r.data, null, 2)))} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
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
  );
}

/* ═══════════════════════════════════════════
   PAYROLL
   ═══════════════════════════════════════════ */
function PayrollView() {
  const [payrolls, setPayrolls] = useLocalState("ap-payrolls", []);
  const load = () => adminService.getPayrolls().then((r) => setPayrolls(r.data.content || r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const processRec = (id) => adminService.processPayroll(id).then(load);
  const payRec = (id) => adminService.payPayroll(id).then(load);
  const deleteRec = (id) => { if (confirm("Delete?")) adminService.deletePayroll(id).then(load); };

  const calculate = () => {
    const uid = prompt("Employee ID:"); if (!uid) return;
    const base = prompt("Base salary:") || "0"; const extra = prompt("Extra salary:", "0") || "0";
    const otHours = prompt("OT hours:", "0") || "0"; const otRate = prompt("OT rate:", "25") || "25";
    const tax = prompt("Tax:", "0") || "0"; const ins = prompt("Insurance:", "0") || "0"; const oth = prompt("Other ded:", "0") || "0";
    adminService.calculatePayroll({ userId: Number(uid), baseSalary: Number(base), extraSalary: Number(extra), overtimeHours: Number(otHours), overtimeRate: Number(otRate), taxDeduction: Number(tax), insuranceDeduction: Number(ins), otherDeductions: Number(oth) }).then(load);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payroll System</h2>
        <div className="flex gap-2">
          <Button onClick={load} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
          <Button onClick={calculate} size="sm"><Icon name="plus" size={14} /> Calculate</Button>
          <Button onClick={() => adminService.bulkProcess().then(load)} variant="outline" size="sm"><Icon name="clock" size={14} /> Bulk Process</Button>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Payroll Records ({payrolls.length})</CardTitle></CardHeader>
        <CardContent>
          {!payrolls.length ? <p className="py-8 text-center text-muted-foreground">No payroll records.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Period</TableHead><TableHead>Base</TableHead><TableHead>OT</TableHead><TableHead>Extra</TableHead><TableHead>Deductions</TableHead><TableHead>Gross</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {payrolls.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-medium">{(pr.user || {}).firstName} {(pr.user || {}).lastName}</TableCell>
                    <TableCell>{pr.payPeriodStart}<br />{pr.payPeriodEnd}</TableCell>
                    <TableCell>${pr.baseSalary}</TableCell><TableCell>${pr.overtimePay || 0}</TableCell><TableCell>${pr.extraSalary || 0}</TableCell><TableCell>${pr.totalDeductions}</TableCell>
                    <TableCell className="font-semibold">${pr.grossSalary}</TableCell><TableCell className="font-semibold text-emerald-600">${pr.netSalary}</TableCell>
                    <TableCell><Badge variant={pr.status === "PAID" ? "success" : pr.status === "PROCESSED" ? "warning" : "default"}>{pr.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {pr.status === "DRAFT" && <button onClick={() => processRec(pr.id)} title="Process" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="clock" size={14} /></button>}
                        {pr.status === "PROCESSED" && <button onClick={() => payRec(pr.id)} title="Mark Paid" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"><Icon name="check" size={14} /></button>}
                        <button onClick={() => adminService.getPayroll(pr.id).then((r) => alert(JSON.stringify(r.data, null, 2)))} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                        <button onClick={() => deleteRec(pr.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="trash" size={14} /></button>
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
  );
}

/* ═══════════════════════════════════════════
   PERFORMANCE REVIEWS
   ═══════════════════════════════════════════ */
function PerformanceView() {
  const [reviews, setReviews] = useLocalState("apr-reviews", []);
  const load = () => adminService.getReviews().then((r) => setReviews(r.data.content || r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = (id) => { if (confirm("Delete review?")) adminService.deleteReview(id).then(load); };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Reviews</h2>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Icon name="plus" size={16} className="text-primary" /> Submit Review</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); const f = e.target; adminService.createReview({ employeeId: Number(f.employeeId.value), reviewPeriodStart: f.periodStart.value, reviewPeriodEnd: f.periodEnd.value, qualityScore: Number(f.quality.value), productivityScore: Number(f.productivity.value), communicationScore: Number(f.communication.value), teamworkScore: Number(f.teamwork.value), punctualityScore: Number(f.punctuality.value), feedback: f.feedback.value, goals: f.goals.value }).then(() => { f.reset(); load(); }); }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { n: "employeeId", l: "Employee ID", type: "number" }, { n: "periodStart", l: "Period Start", type: "date" }, { n: "periodEnd", l: "Period End", type: "date" },
                { n: "quality", l: "Quality (1-5)", type: "number" }, { n: "productivity", l: "Productivity (1-5)", type: "number" }, { n: "communication", l: "Communication (1-5)", type: "number" },
                { n: "teamwork", l: "Teamwork (1-5)", type: "number" }, { n: "punctuality", l: "Punctuality (1-5)", type: "number" },
              ].map(({ n, l, type = "text" }) => (
                <div key={n}><label className="mb-1 block text-xs font-medium text-muted-foreground">{l}</label><Input name={n} type={type} min={type === "number" ? 1 : null} max={type === "number" ? 5 : null} required /></div>
              ))}
            </div>
            <div className="mt-4"><label className="mb-1 block text-xs font-medium text-muted-foreground">Feedback</label><Textarea name="feedback" rows="3" required /></div>
            <div className="mt-4"><label className="mb-1 block text-xs font-medium text-muted-foreground">Goals / Areas of Improvement</label><Textarea name="goals" rows="2" /></div>
            <Button type="submit" className="mt-4"><Icon name="check" size={14} /> Submit Review</Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button onClick={load} variant="secondary" size="sm"><Icon name="refresh" size={14} /> Refresh</Button>
        <Button onClick={() => { const id = prompt("Employee ID:"); if (id) adminService.getEmployeePerformance(Number(id)).then((r) => alert(JSON.stringify(r.data, null, 2))); }} variant="outline" size="sm"><Icon name="users" size={14} /> Employee Performance</Button>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">All Reviews ({reviews.length})</CardTitle></CardHeader>
        <CardContent>
          {!reviews.length ? <p className="py-8 text-center text-muted-foreground">No reviews yet.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Period</TableHead><TableHead>Quality</TableHead><TableHead>Productivity</TableHead><TableHead>Overall</TableHead><TableHead>Goals</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {reviews.map((rw) => (
                  <TableRow key={rw.id}>
                    <TableCell className="font-medium">{(rw.employee || {}).firstName} {(rw.employee || {}).lastName}</TableCell>
                    <TableCell>{rw.reviewPeriodStart} — {rw.reviewPeriodEnd}</TableCell>
                    <TableCell>{rw.qualityScore}/5</TableCell><TableCell>{rw.productivityScore}/5</TableCell>
                    <TableCell className="font-bold text-primary">{rw.overallScore}/5</TableCell>
                    <TableCell className="max-w-[200px] truncate">{rw.goals}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button onClick={() => adminService.getReview(rw.id).then((r) => alert(JSON.stringify(r.data, null, 2)))} title="Details" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"><Icon name="eye" size={14} /></button>
                        <button onClick={() => del(rw.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"><Icon name="trash" size={14} /></button>
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
  );
}
