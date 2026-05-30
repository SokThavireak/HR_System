import { ArrowUpRight } from "lucide-react";

const invoices = [
  {
    id: "INV-001",
    name: "Jane Cooper",
    amount: "$2,400",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "INV-002",
    name: "John Smith",
    amount: "$1,800",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "INV-003",
    name: "Alice Johnson",
    amount: "$3,200",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "INV-004",
    name: "Bob Wilson",
    amount: "$2,100",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "INV-005",
    name: "Sarah Davis",
    amount: "$1,650",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  },
];

export function DashboardInvoices() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">
          Recent Payroll
        </span>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#7A6BFF] hover:underline">
          View All <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
          >
            <img
              src={inv.avatar}
              alt={inv.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {inv.name}
              </p>
              <p className="text-xs text-slate-400">{inv.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{inv.amount}</p>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  inv.status === "Paid"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardInvoices;
