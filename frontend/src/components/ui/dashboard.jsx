import { DashboardInvoices } from "@/components/ui/dashboard-invoices";
import { SalesChart } from "@/components/ui/chart-one";

export function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold leading-tight">
          Welcome back, Admin!
        </h1>
        <p className="text-base text-slated-500">
          Let's get things done.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Employees"
          value="24"
          bg="#FF8FB3"
        />
        <StatCard
          label="Attendance Rate"
          value="96%"
          bg="#61D4F8"
        />
        <StatCard
          label="Pending Leaves"
          value="3"
          bg="#FF9B8A"
        />
        <StatCard
          label="Monthly Payroll"
          value="$48.2k"
          bg="#C293FF"
        />
      </div>

      {/* Bottom Section: Chart + Recent Payroll */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E8EBF0] bg-white p-6">
          <SalesChart />
        </div>
        <div className="rounded-xl border border-[#E8EBF0] bg-white p-6">
          <DashboardInvoices />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, bg }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-6 text-white"
      style={{ background: bg }}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl font-black">
        {value.charAt(0) === "$" ? (
          <span className="text-2xl">💰</span>
        ) : value.includes("%") ? (
          <span className="text-2xl">📊</span>
        ) : (
          <span className="text-2xl">👥</span>
        )}
      </div>
      <div>
        <p className="text-3xl font-black leading-none">{value}</p>
        <p className="mt-1 text-sm font-semibold text-white/85">{label}</p>
      </div>
    </div>
  );
}

export default Dashboard;
