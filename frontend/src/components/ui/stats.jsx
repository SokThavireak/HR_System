import { Users, CheckCircle, Clock, DollarSign } from "lucide-react";

const statsData = [
  {
    label: "Total Employees",
    value: "24",
    icon: Users,
    bg: "bg-[#FF8FB3]",
  },
  {
    label: "Attendance Rate",
    value: "96%",
    icon: CheckCircle,
    bg: "bg-[#61D4F8]",
  },
  {
    label: "Pending Leaves",
    value: "3",
    icon: Clock,
    bg: "bg-[#FF9B8A]",
  },
  {
    label: "Monthly Payroll",
    value: "$48.2k",
    icon: DollarSign,
    bg: "bg-[#C293FF]",
  },
];

export function DashboardStats() {
  return (
    <>
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bg} flex items-center gap-4 rounded-2xl p-6 text-white`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black leading-none">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-white/85">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DashboardStats;
