import { LogOut } from "lucide-react";

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

  return (
    <div className="flex min-h-screen" style={{ background: "#efe6dd" }}>
      {/* Sidebar — Cherry Cola #9a0002 */}
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
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`mb-1 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                current.key === item.key
                  ? "text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              style={current.key === item.key ? { background: "rgba(255,255,255,0.15)" } : {}}
            >
              <span>{item.label}</span>
            </button>
          ))}
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

      {/* Main Content */}
      <div className="ml-[290px] flex flex-1 flex-col" style={{ background: "transparent" }}>
        {/* Top Bar — no background */}
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

        {/* Page Content */}
        <main className="flex-1 p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
