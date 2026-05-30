import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 52 },
  { month: "May", value: 88 },
  { month: "Jun", value: 70 },
  { month: "Jul", value: 95 },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

export function SalesChart() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-[#7A6BFF]" />
        <span className="text-sm font-bold text-slate-700">
          Attendance Overview
        </span>
      </div>
      <div className="flex flex-1 items-end gap-3">
        {chartData.map((bar) => (
          <div
            key={bar.month}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span className="text-xs font-semibold text-slate-500">
              {bar.value}%
            </span>
            <div
              className="w-full rounded-lg transition-all duration-300"
              style={{
                height: `${(bar.value / maxValue) * 120}px`,
                background:
                  bar.value === maxValue
                    ? "#7A6BFF"
                    : "linear-gradient(180deg, #EEECFF 0%, #D5D0FF 100%)",
              }}
            />
            <span className="text-xs font-medium text-slate-400">
              {bar.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesChart;
