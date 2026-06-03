import React, { useState, useEffect } from "react";
import "./Loader.css";

/* ═══════════════════════════════════════════
   LOGIN LOADER — 3D bouncing cubes (unchanged)
   ═══════════════════════════════════════════ */
const CubeFaces = () => (
  <>
    <div className="face face-front" />
    <div className="face face-right" />
    <div className="face face-top" />
    <div className="face face-back" />
  </>
);

export const LoginLoader = () => (
  <div className="loader-container">
    <div className="boxes boxes-large">
      <div className="box box-1"><CubeFaces /></div>
      <div className="box box-2"><CubeFaces /></div>
      <div className="box box-3"><CubeFaces /></div>
      <div className="box box-4"><CubeFaces /></div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   SHARED SKELETON PRIMITIVES
   ═══════════════════════════════════════════ */
const SkeletonBlock = ({ className, style, delay = 0, children, tag: Tag = "div" }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <Tag
      className={`sk-block ${className ?? ""}`}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </Tag>
  );
};

const Shimmer = ({ className, style, delay = 0 }) => (
  <div
    className={`sk-shimmer ${className ?? ""}`}
    style={{ ...style, animationDelay: `${delay}ms` }}
  />
);

const PulsingDot = ({ color = "#9a0002", delay = 0 }) => (
  <span
    className="sk-dot"
    style={{ background: color, animationDelay: `${delay}ms` }}
  />
);

/* ── Progress bar ── */
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const steps = [12, 28, 45, 62, 78, 90, 100];
    const timers = steps.map((val, i) =>
      setTimeout(() => setProgress(val), 300 + i * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div
        className="h-full rounded-r-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #9a0002, #d32f2f)",
          transition: "width 0.3s ease",
          boxShadow: progress > 0 ? "0 0 10px rgba(154,0,2,0.5)" : "none",
        }}
      />
    </div>
  );
};


/* ═══════════════════════════════════════════
   EMPLOYEE DASHBOARD SKELETON (content only)
   The real header + bottom nav stay visible.
   Matches: welcome + clock card + 4 stat cards
           + 3 mini cards + recent leaves timeline
   ═══════════════════════════════════════════ */
export const EmployeeDashboardSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Welcome title */}
      <div className="space-y-2.5 pt-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-80 rounded-lg" /></SkeletonBlock>
        <SkeletonBlock delay={180}><Shimmer className="h-4 w-72 rounded" /></SkeletonBlock>
      </div>

      {/* Clock Card — the big gradient card with circle button */}
      <SkeletonBlock delay={250} className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(154,0,2,0.12), rgba(154,0,2,0.06))" }}>
        <div className="p-8 text-center space-y-5">
          <Shimmer className="h-4 w-40 mx-auto rounded" />
          <Shimmer className="h-14 w-48 mx-auto rounded-xl" />
          {/* Clock in/out circle button */}
          <div className="flex justify-center">
            <div
              className="sk-pulse flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full"
              style={{
                border: "4px solid rgba(154,0,2,0.15)",
                background: "rgba(154,0,2,0.06)",
                animationDuration: "2.2s",
              }}
            >
              <div className="h-8 w-8 rounded-full" style={{ background: "rgba(154,0,2,0.1)" }} />
              <Shimmer className="h-2.5 w-14 rounded" />
            </div>
          </div>
          <Shimmer className="h-3 w-56 mx-auto rounded" />
        </div>
      </SkeletonBlock>

      {/* 4 Stat Cards row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { bg: "#9a0002" },
          { bg: "#3b82f6" },
          { bg: "#f59e0b" },
          { bg: "#22c55e" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={400 + i * 100}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div
              className="sk-pulse h-10 w-10 shrink-0 rounded-lg"
              style={{ background: `${s.bg}22`, animationDelay: `${i * 200}ms` }}
            />
            <div className="space-y-2 flex-1">
              <Shimmer className="h-6 w-10 rounded" delay={i * 80} />
              <Shimmer className="h-3 w-20 rounded" delay={i * 80} />
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* 3 Mini Cards: Attendance Rate / Total Leaves / Performance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonBlock
            key={i}
            delay={750 + i * 120}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
          >
            <Shimmer className="h-3 w-28 rounded" />
            <div className="flex items-end gap-2">
              <Shimmer className="h-9 w-14 rounded" />
              <Shimmer className="h-3 w-10 rounded mb-1" />
            </div>
            {/* Progress bar or dots */}
            {i === 0 && <Shimmer className="h-2 w-full rounded-full" />}
            {i === 1 && (
              <div className="flex gap-1.5">
                <Shimmer className="h-5 w-16 rounded-full" />
                <Shimmer className="h-5 w-14 rounded-full" />
              </div>
            )}
            {i === 2 && (
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className="h-2 flex-1 rounded-full" style={{ background: "rgba(154,0,2,0.1)" }} />
                ))}
              </div>
            )}
          </SkeletonBlock>
        ))}
      </div>

      {/* Recent Leave Requests — timeline style */}
      <SkeletonBlock delay={1100} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-44 rounded" />
          <Shimmer className="h-8 w-20 rounded-lg" />
        </div>
        <div className="relative space-y-1 px-6 pb-6 pl-10">
          <div className="absolute left-[29px] top-2 bottom-2 w-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative py-2.5">
              <div
                className="absolute -left-[17px] top-3 h-2.5 w-2.5 rounded-full"
                style={{ background: "rgba(154,0,2,0.15)" }}
              />
              <div className="flex items-center gap-2">
                <Shimmer className="h-4 w-20 rounded" delay={i * 100} />
                <Shimmer className="h-3 w-24 rounded" delay={i * 100} />
                <Shimmer className="h-5 w-16 rounded-full" delay={i * 100} />
              </div>
              <Shimmer className="mt-1.5 h-3 w-48 rounded" delay={i * 100} />
            </div>
          ))}
        </div>
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1400} className="flex items-center justify-center gap-3 pt-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading your dashboard…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   ATTENDANCE PAGE SKELETON (content only)
   The real header or admin shell stays visible.
   Matches: title + summary cards + table with pagination
   ═══════════════════════════════════════════ */
export const AttendancePageSkeleton = () => (
  <>
    <ProgressBar />
    <div className="p-6 pb-24 min-h-[calc(100vh-8rem)] space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-56 rounded-lg" /></SkeletonBlock>
        <SkeletonBlock delay={180}><Shimmer className="h-4 w-64 rounded" /></SkeletonBlock>
      </div>

      {/* Summary cards — 4 columns */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { bg: "#9a0002" },
          { bg: "#22c55e" },
          { bg: "#f59e0b" },
          { bg: "#3b82f6" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={250 + i * 100}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <Shimmer className="h-3 w-24 rounded" />
            <div className="flex items-end gap-2">
              <Shimmer className="h-8 w-12 rounded" />
              <Shimmer className="h-3 w-8 rounded mb-1" />
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* Filter bar */}
      <SkeletonBlock delay={600} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <Shimmer className="h-9 w-36 rounded-lg" />
        <Shimmer className="h-9 w-32 rounded-lg" />
        <Shimmer className="h-9 w-28 rounded-lg" />
        <div className="flex-1" />
        <Shimmer className="h-9 w-24 rounded-lg" />
      </SkeletonBlock>

      {/* Attendance table */}
      <SkeletonBlock delay={750} className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3.5" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Date", "Clock In", "Clock Out", "Status", "Hours"].map((h, i) => (
            <div key={h} className="flex-1 sk-table-head" style={{ animationDelay: `${i * 80}ms` }}>
              <Shimmer className="h-4 rounded" style={{ width: `${50 + i * 10}%` }} />
            </div>
          ))}
        </div>
        {/* Table rows */}
        {[0, 1, 2, 3, 4, 5, 6].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 100}ms` }}
          >
            {[0, 1, 2, 3, 4].map((colIdx) => (
              <div key={colIdx} className="flex-1 flex items-center">
                {colIdx === 3 ? (
                  <Shimmer className={`h-5 w-16 rounded-full`} delay={rowIdx * 60} />
                ) : (
                  <Shimmer
                    className="h-3.5 rounded"
                    style={{ width: `${colIdx === 0 ? 65 : 55}%` }}
                    delay={rowIdx * 60}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </SkeletonBlock>

      {/* Pagination */}
      <SkeletonBlock delay={1300} className="flex items-center justify-between">
        <Shimmer className="h-4 w-36 rounded" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Shimmer key={i} className="h-9 w-9 rounded-lg" />
          ))}
        </div>
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1500} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading attendance records…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   ADMIN DASHBOARD SKELETON (content only)
   The real sidebar + top bar stay visible.
   Matches: title + 4 stat cards + 4 payroll cards
           + donut chart card + attendance bars
   ═══════════════════════════════════════════ */
export const AdminDashboardSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-48 rounded-lg" /></SkeletonBlock>
        <SkeletonBlock delay={180}><Shimmer className="h-4 w-96 rounded" /></SkeletonBlock>
      </div>

      {/* 4 main stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { bg: "#9a0002" },
          { bg: "#22c55e" },
          { bg: "#f59e0b" },
          { bg: "#ef4444" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={250 + i * 100}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}
          >
            <div className="flex items-center gap-4">
              <div
                className="sk-pulse h-11 w-11 shrink-0 rounded-lg"
                style={{ background: `${s.bg}18`, animationDelay: `${i * 200}ms` }}
              />
              <div className="space-y-2">
                <Shimmer className="h-7 w-10 rounded" />
                <Shimmer className="h-3 w-24 rounded" />
              </div>
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* 4 payroll breakdown cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { bg: "#6366f1" },
          { bg: "#14b8a6" },
          { bg: "#ec4899" },
          { bg: "#f97316" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={600 + i * 100}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}
          >
            <div className="flex items-center gap-3">
              <div
                className="sk-pulse h-10 w-10 shrink-0 rounded-lg"
                style={{ background: `${s.bg}18`, animationDelay: `${i * 150}ms` }}
              />
              <div className="space-y-1.5">
                <Shimmer className="h-3 w-20 rounded" />
                <Shimmer className="h-6 w-16 rounded" />
              </div>
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* Donut chart + Department table card */}
      <SkeletonBlock delay={1000} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-52 rounded" />
          <Shimmer className="h-4 w-28 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 px-6 pb-6">
          {/* Donut chart placeholder */}
          <div className="flex items-center justify-center lg:col-span-2">
            <div
              className="sk-pulse rounded-full"
              style={{
                width: 180,
                height: 180,
                background: "conic-gradient(rgba(154,0,2,0.08) 0deg, rgba(59,130,246,0.08) 90deg, rgba(245,158,11,0.08) 180deg, rgba(34,197,94,0.08) 270deg, rgba(139,92,246,0.08) 360deg)",
                animationDuration: "3s",
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="rounded-full bg-white" style={{ width: 100, height: 100 }} />
              </div>
            </div>
          </div>
          {/* Department table */}
          <div className="lg:col-span-3 space-y-3">
            {/* Table header */}
            <div className="flex gap-4 pb-2 border-b border-border/50">
              {["Department", "Employees", "% of Total", "Distribution"].map((h, i) => (
                <div key={h} className={i === 3 ? "flex-[2]" : "flex-1"}>
                  <Shimmer className="h-3.5 w-16 rounded" delay={i * 60} />
                </div>
              ))}
            </div>
            {/* Rows */}
            {["HR", "Engineering", "Marketing", "Finance", "Operations"].map((dept, i) => (
              <div key={dept} className="flex gap-4 items-center sk-table-row" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "rgba(154,0,2,0.12)" }} />
                  <Shimmer className="h-3.5 w-20 rounded" />
                </div>
                <div className="flex-1"><Shimmer className="h-3.5 w-8 rounded" /></div>
                <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" /></div>
                <div className="flex-[2]"><Shimmer className="h-3 w-full rounded-full" /></div>
              </div>
            ))}
            {/* Total row */}
            <div className="flex gap-4 items-center pt-2 border-t border-border/50" style={{ background: "rgba(0,0,0,0.02)" }}>
              <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" /></div>
              <div className="flex-1"><Shimmer className="h-3.5 w-8 rounded" /></div>
              <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" /></div>
              <div className="flex-[2]" />
            </div>
          </div>
        </div>
      </SkeletonBlock>

      {/* Weekly Attendance Trend — horizontal bars */}
      <SkeletonBlock delay={1400} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-52 rounded" />
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(154,0,2,0.15)" }} />
                <Shimmer className="h-2.5 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => (
            <div key={day} className="flex items-center gap-4 sk-table-row" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="w-20 text-right shrink-0"><Shimmer className="h-3 w-16 ml-auto rounded" /></span>
              <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                <Shimmer
                  className="h-full rounded-lg"
                  style={{ width: `${95 - i * 10}%` }}
                  delay={i * 60}
                />
              </div>
              <span className="w-24 shrink-0"><Shimmer className="h-3 w-20 rounded" /></span>
            </div>
          ))}
          {/* Weekly average footer */}
          <div className="flex items-center justify-between rounded-lg px-4 py-2.5 mt-2" style={{ background: "rgba(0,0,0,0.02)" }}>
            <Shimmer className="h-3 w-24 rounded" />
            <div className="flex items-center gap-3">
              <Shimmer className="h-5 w-12 rounded" />
              <Shimmer className="h-2.5 w-28 rounded" />
            </div>
          </div>
        </div>
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1700} className="flex items-center justify-center gap-3 pt-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading dashboard…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   ADMIN TABLE SKELETON (content only)
   The real sidebar + top bar stay visible.
   For Employees, Leaves, Payroll, Performance
   Matches: title + action bar + data table
   ═══════════════════════════════════════════ */
export const AdminTableSkeleton = ({ columns = 5, rows = 7 }) => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-56 rounded-lg" /></SkeletonBlock>
        <SkeletonBlock delay={180}><Shimmer className="h-4 w-72 rounded" /></SkeletonBlock>
      </div>

      {/* Action bar */}
      <SkeletonBlock delay={250} className="flex flex-wrap items-center gap-3">
        <Shimmer className="h-9 w-48 rounded-lg" />
        <Shimmer className="h-9 w-36 rounded-lg" />
        <div className="flex-1" />
        <Shimmer className="h-9 w-28 rounded-lg" />
      </SkeletonBlock>

      {/* Table */}
      <SkeletonBlock delay={400} className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-border/60 px-5 py-3.5" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 sk-table-head" style={{ animationDelay: `${i * 80}ms` }}>
              <Shimmer className="h-4 rounded" style={{ width: `${45 + i * 12}%` }} />
            </div>
          ))}
          <div className="w-20 shrink-0 sk-table-head">
            <Shimmer className="h-4 w-14 rounded" />
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 90}ms` }}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div key={colIdx} className="flex-1 flex items-center">
                {colIdx === columns - 1 ? (
                  <Shimmer className="h-5 w-16 rounded-full" delay={rowIdx * 50} />
                ) : (
                  <Shimmer
                    className="h-3.5 rounded"
                    style={{ width: `${colIdx === 0 ? 70 : 55}%` }}
                    delay={rowIdx * 50}
                  />
                )}
              </div>
            ))}
            {/* Action buttons */}
            <div className="w-20 shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Pagination */}
      <SkeletonBlock delay={1200} className="flex items-center justify-between">
        <Shimmer className="h-4 w-40 rounded" />
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-9 w-9 rounded-lg" />
          ))}
        </div>
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1400} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading data…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   DEPARTMENT & POSITION SKELETON (content only)
   The real sidebar + top bar stay visible.
   Matches: title + 2 stat cards + tabs + form + table
   ═══════════════════════════════════════════ */
export const DeptPositionSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-72 rounded-lg" /></SkeletonBlock>
        <SkeletonBlock delay={180}><Shimmer className="h-4 w-80 rounded" /></SkeletonBlock>
      </div>

      {/* 2 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { bg: "#9a0002" },
          { bg: "#3b82f6" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={250 + i * 100}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}
          >
            <div
              className="sk-pulse h-11 w-11 shrink-0 rounded-lg"
              style={{ background: `${s.bg}18`, animationDelay: `${i * 200}ms` }}
            />
            <div className="space-y-1.5">
              <Shimmer className="h-7 w-10 rounded" />
              <Shimmer className="h-3 w-24 rounded" />
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* Tabs */}
      <SkeletonBlock delay={450} className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(0,0,0,0.06)" }}>
        <Shimmer className="h-10 flex-1 rounded-lg" />
        <Shimmer className="h-10 flex-1 rounded-lg" />
      </SkeletonBlock>

      {/* Form card */}
      <SkeletonBlock delay={550} className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <Shimmer className="h-5 w-44 rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-24 rounded" />
              <Shimmer className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-10 w-32 rounded-lg" />
          <Shimmer className="h-10 w-20 rounded-lg" />
        </div>
      </SkeletonBlock>

      {/* Data table */}
      <SkeletonBlock delay={750} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-40 rounded" />
        </div>
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Name", "Description", "Actions"].map((h, i) => (
            <div key={h} className={i === 2 ? "w-24 shrink-0" : "flex-1"}>
              <Shimmer className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[0, 1, 2, 3].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-3.5 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 100}ms` }}
          >
            <div className="flex-1"><Shimmer className="h-3.5 w-24 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-40 rounded" /></div>
            <div className="w-24 shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1200} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   ADMIN ATTENDANCE SKELETON (content only)
   Matches: title + 4 KPI cards + filter card + form + table
   ═══════════════════════════════════════════ */
export const AdminAttendanceSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title + actions */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock delay={100}>
            <div className="flex items-center gap-2.5">
              <div className="sk-pulse h-9 w-9 rounded-lg" style={{ background: "rgba(154,0,2,0.1)" }} />
              <Shimmer className="h-8 w-56 rounded-lg" />
            </div>
          </SkeletonBlock>
          <SkeletonBlock delay={160}><Shimmer className="h-4 w-64 rounded" /></SkeletonBlock>
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-9 w-24 rounded-lg" delay={200} />
          <Shimmer className="h-9 w-28 rounded-lg" delay={220} />
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { bg: "#9a0002" },
          { bg: "#22c55e" },
          { bg: "#f59e0b" },
          { bg: "#3b82f6" },
        ].map((s, i) => (
          <SkeletonBlock
            key={i}
            delay={300 + i * 100}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: s.bg }}
          >
            <div
              className="sk-pulse h-11 w-11 shrink-0 rounded-lg"
              style={{ background: `${s.bg}18`, animationDelay: `${i * 200}ms` }}
            />
            <div className="space-y-2">
              <Shimmer className="h-7 w-10 rounded" />
              <Shimmer className="h-3 w-20 rounded" />
            </div>
          </SkeletonBlock>
        ))}
      </div>

      {/* Filter card */}
      <SkeletonBlock delay={700} className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Shimmer className="h-5 w-20 rounded" />
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2 min-w-[140px] flex-1">
            <Shimmer className="h-3 w-12 rounded" />
            <Shimmer className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2 min-w-[140px] flex-1">
            <Shimmer className="h-3 w-12 rounded" />
            <Shimmer className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2 min-w-[150px] flex-1">
            <Shimmer className="h-3 w-20 rounded" />
            <Shimmer className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2 min-w-[140px] flex-1">
            <Shimmer className="h-3 w-14 rounded" />
            <Shimmer className="h-10 w-full rounded-lg" />
          </div>
          <Shimmer className="h-10 w-20 rounded-lg" />
        </div>
      </SkeletonBlock>

      {/* Manual entry form card */}
      <SkeletonBlock delay={900} className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Shimmer className="h-5 w-40 rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-20 rounded" />
              <Shimmer className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Shimmer className="h-10 w-28 rounded-lg" />
      </SkeletonBlock>

      {/* Attendance log table */}
      <SkeletonBlock delay={1100} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-32 rounded" />
          <Shimmer className="h-5 w-20 rounded-full" />
        </div>
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Employee", "Date", "Clock In", "Clock Out", "Worked", "Status", "Source", "Actions"].map((h, i) => (
            <div key={h} className={i === 7 ? "w-[120px] shrink-0" : "flex-1"}>
              <Shimmer className="h-4 w-14 rounded" delay={i * 50} />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[0,1,2,3,4,5].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 80}ms` }}
          >
            <div className="flex-1 space-y-1"><Shimmer className="h-3.5 w-24 rounded" /><Shimmer className="h-2.5 w-16 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-20 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-14 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-14 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-5 w-16 rounded-full" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-14 rounded" /></div>
            <div className="w-[120px] shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1500} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading attendance…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   LEAVE APPROVALS SKELETON (content only)
   Matches: title + pending requests table
   ═══════════════════════════════════════════ */
export const LeaveApprovalsSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title + refresh */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock delay={100}><Shimmer className="h-8 w-48 rounded-lg" /></SkeletonBlock>
        </div>
        <SkeletonBlock delay={180}><Shimmer className="h-9 w-24 rounded-lg" /></SkeletonBlock>
      </div>

      {/* Pending requests table */}
      <SkeletonBlock delay={300} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-44 rounded" />
        </div>
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3.5" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Employee", "Type", "From", "To", "Days", "Reason", "Actions"].map((h, i) => (
            <div key={h} className={i === 6 ? "w-28 shrink-0" : "flex-1"}>
              <Shimmer className="h-4 rounded" style={{ width: i === 5 ? "90%" : "60%" }} />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[0,1,2,3,4].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 100}ms` }}
          >
            <div className="flex-1"><Shimmer className="h-3.5 w-24 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-16 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-20 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-20 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-8 rounded" /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-32 rounded" /></div>
            <div className="w-28 shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={900} className="flex items-center justify-center gap-3 pt-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading leave requests…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   PAYROLL SKELETON (content only)
   Matches: title + action buttons + payroll table
   ═══════════════════════════════════════════ */
export const PayrollSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title + action buttons */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock delay={100}><Shimmer className="h-8 w-44 rounded-lg" /></SkeletonBlock>
        </div>
        <div className="flex gap-2">
          <SkeletonBlock delay={180}><Shimmer className="h-9 w-24 rounded-lg" /></SkeletonBlock>
          <SkeletonBlock delay={220}><Shimmer className="h-9 w-28 rounded-lg" /></SkeletonBlock>
          <SkeletonBlock delay={260}><Shimmer className="h-9 w-32 rounded-lg" /></SkeletonBlock>
        </div>
      </div>

      {/* Payroll records table */}
      <SkeletonBlock delay={400} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-40 rounded" />
        </div>
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Employee", "Period", "Base", "OT", "Extra", "Deduct", "Gross", "Net", "Status", "Actions"].map((h, i) => (
            <div key={h} className={i === 9 ? "w-28 shrink-0" : "flex-1"}>
              <Shimmer className="h-3.5 w-12 rounded" />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[0,1,2,3,4,5].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 80}ms` }}
          >
            <div className="flex-1"><Shimmer className="h-3.5 w-24 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1 space-y-1"><Shimmer className="h-3 w-16 rounded" delay={rowIdx * 50} /><Shimmer className="h-3 w-16 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-12 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-12 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-12 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-5 w-16 rounded-full" delay={rowIdx * 50} /></div>
            <div className="w-28 shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1200} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading payroll…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   PERFORMANCE REVIEWS SKELETON (content only)
   Matches: title + form card + reviews table
   ═══════════════════════════════════════════ */
export const PerformanceSkeleton = () => (
  <>
    <ProgressBar />
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <SkeletonBlock delay={100}><Shimmer className="h-8 w-52 rounded-lg" /></SkeletonBlock>
      </div>

      {/* Submit review form */}
      <SkeletonBlock delay={250} className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Shimmer className="h-5 w-36 rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-24 rounded" />
              <Shimmer className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-2"><Shimmer className="h-3 w-16 rounded" /><Shimmer className="h-10 w-full rounded-lg" /></div>
        <div className="space-y-2"><Shimmer className="h-3 w-44 rounded" /><Shimmer className="h-10 w-full rounded-lg" /></div>
        <Shimmer className="h-10 w-32 rounded-lg" />
      </SkeletonBlock>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Shimmer className="h-9 w-24 rounded-lg" delay={500} />
        <Shimmer className="h-9 w-40 rounded-lg" delay={540} />
      </div>

      {/* Reviews table */}
      <SkeletonBlock delay={700} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <Shimmer className="h-5 w-36 rounded" />
        </div>
        {/* Table header */}
        <div className="flex border-b border-border/60 px-5 py-3" style={{ background: "hsl(var(--muted) / 0.3)" }}>
          {["Employee", "Period", "Quality", "Productivity", "Overall", "Goals", "Actions"].map((h, i) => (
            <div key={h} className={i === 6 ? "w-28 shrink-0" : "flex-1"}>
              <Shimmer className="h-4 w-14 rounded" />
            </div>
          ))}
        </div>
        {/* Rows */}
        {[0,1,2,3,4].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/40 px-5 py-4 last:border-0 sk-table-row"
            style={{ animationDelay: `${rowIdx * 100}ms` }}
          >
            <div className="flex-1"><Shimmer className="h-3.5 w-24 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1 space-y-1"><Shimmer className="h-3 w-16 rounded" delay={rowIdx * 50} /><Shimmer className="h-3 w-16 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-10 rounded" delay={rowIdx * 50} /></div>
            <div className="flex-1"><Shimmer className="h-3.5 w-32 rounded" delay={rowIdx * 50} /></div>
            <div className="w-28 shrink-0 flex gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
              <Shimmer className="h-8 w-8 rounded-lg" delay={rowIdx * 50} />
            </div>
          </div>
        ))}
      </SkeletonBlock>

      {/* Loading indicator */}
      <SkeletonBlock delay={1300} className="flex items-center justify-center gap-3 pt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} color="#9a0002" delay={i * 400} />
          ))}
        </div>
        <span className="sk-text-fade text-sm font-medium" style={{ color: "#9a0002" }}>
          Loading reviews…
        </span>
      </SkeletonBlock>
    </div>
  </>
);


/* ═══════════════════════════════════════════
   LEGACY — generic PageLoader (kept for any
   remaining imports that haven't been updated)
   ═══════════════════════════════════════════ */
export const PageLoader = () => <EmployeeDashboardSkeleton />;
