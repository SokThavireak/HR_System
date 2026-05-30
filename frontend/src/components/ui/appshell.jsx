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
    <div className="flex min-h-screen" style={{ background: "#F4F5F9" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col border-r border-[#E8EBF0] bg-white"
      >
        <div className="px-6 pt-7 pb-8">
          <div className="text-2xl font-black leading-none tracking-tight text-[#7A6BFF]">
            HRMS
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Admin Portal
          </div>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`mb-1 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                current.key === item.key
                  ? "bg-[#EEECFF] text-[#7A6BFF]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-[#F1F5F9] p-5">
          <button
            onClick={() => {
              localStorage.removeItem("hrms_token");
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[290px] flex flex-1 flex-col" style={{ background: "#F4F5F9" }}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-[84px] items-center justify-between bg-[#7A6BFF] px-9 text-white">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold tracking-tight">
              {current.title}
            </h1>
          </div>
          <time className="text-sm font-semibold text-white/85">
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
