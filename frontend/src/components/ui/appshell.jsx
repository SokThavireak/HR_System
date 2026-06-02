import React, { useState } from "react";
import { LogOut, BarChart3, Users, Clock, ClipboardCheck, DollarSign, TrendingUp } from "lucide-react";

const NAV_ICONS = {
  dashboard: BarChart3,
  users: Users,
  attendance: Clock,
  leaves: ClipboardCheck,
  payroll: DollarSign,
  performance: TrendingUp,
};

export function AppShell({ children, currentPage }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", title: "Dashboard" },
    { key: "users", label: "User Management", title: "User Management" },
    { key: "attendance", label: "Attendance", title: "Attendance" },
    { key: "leaves", label: "Leave Approvals", title: "Leave Approvals" },
    { key: "payroll", label: "Payroll", title: "Payroll" },
    { key: "performance", label: "Performance", title: "Performance" },
  ];

  const current = navItems.find((n) => n.key === currentPage?.key) || navItems[0];
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div className="flex min-h-screen" style={{ background: "#efe6dd" }}>
      <aside
        className="fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col"
        style={{ background: "#9a0002" }}
      >
        <div className="px-3 pb-8 pt-8">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-black leading-none tracking-tight text-white">HRMS</span>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const isActive = current.key === item.key;
            const isHovered = hoveredKey === item.key;
            const Icon = NAV_ICONS[item.key];
            return (
              <button
                key={item.key}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`sidebar-nav-btn mb-1 flex w-full items-center gap-3 rounded-xl text-left font-bold tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "sidebar-nav-active text-white"
                    : "text-white/60"
                }`}
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 100%)"
                    : isHovered
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 6px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "none",
                  minHeight: "52px",
                  padding: "12px 12px 12px 16px",
                  position: "relative",
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.18)"
                      : "transparent",
                  }}
                >
                  {Icon && <Icon size={18} />}
                </span>
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={() => {
              localStorage.removeItem("hrms_token");
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* pill indicator on sidebar edge for active item */}
      <style>{`
        @keyframes navPopup {
          0%   { transform: scale(0.85) translateX(-12px); opacity: 0; }
          60%  { transform: scale(1.04) translateX(0); opacity: 1; }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
        .sidebar-nav-btn {
          animation: navPopup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .sidebar-nav-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 58%;
          border-radius: 0 4px 4px 0;
          background: #fff;
        }
      `}</style>

      <div className="ml-[290px] flex flex-1 flex-col" style={{ background: "transparent" }}>
        <header className="sticky top-0 z-40 flex h-[84px] items-center justify-between px-9 border-b border-gray-200/50" style={{ background: "transparent" }}>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {current.title}
            </h1>
          </div>
          <time className="text-sm font-semibold text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <main className="flex-1 p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
