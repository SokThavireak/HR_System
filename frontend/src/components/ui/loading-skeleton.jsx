import React from "react";

/**
 * Loading skeleton with shimmer animation.
 * Matches the design system's color tokens.
 *
 * Usage:
 *   <LoadingSkeleton variant="card" count={3} />
 *   <LoadingSkeleton variant="table" rows={5} />
 *   <LoadingSkeleton variant="list" count={4} />
 */
export function LoadingSkeleton({ variant = "card", count = 3, rows = 5 }) {
  if (variant === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl loading-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded-lg loading-shimmer" />
                <div className="h-3 w-1/2 rounded-lg loading-shimmer" />
              </div>
            </div>
            <div className="h-3 w-full rounded-lg loading-shimmer" />
            <div className="h-3 w-5/6 rounded-lg loading-shimmer" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-20 rounded-lg loading-shimmer" />
              <div className="h-8 w-20 rounded-lg loading-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="flex border-b border-border bg-muted/50 px-5 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1">
              <div className="h-4 w-16 rounded loading-shimmer" />
            </div>
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex border-b border-border/50 px-5 py-3.5 last:border-0"
          >
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <div key={colIdx} className="flex-1">
                <div
                  className={`h-3 rounded loading-shimmer ${
                    colIdx === 0 ? "w-24" : colIdx === 4 ? "w-16" : "w-20"
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
          >
            <div className="h-10 w-10 rounded-full loading-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded-lg loading-shimmer" />
              <div className="h-3 w-2/3 rounded-lg loading-shimmer" />
            </div>
            <div className="h-8 w-20 rounded-lg loading-shimmer shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full loading-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/5 rounded-lg loading-shimmer" />
            <div className="h-4 w-3/5 rounded-lg loading-shimmer" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-4 w-24 rounded loading-shimmer shrink-0" />
              <div className="h-4 flex-1 rounded loading-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: simple block
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 w-full rounded-xl loading-shimmer" />
      ))}
    </div>
  );
}

/** Spinner using LordIcon loading animation */
export function LoadingSpinner({ size = 48, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <lord-icon
        src="https://cdn.lordicon.com/ktsahhoi.json"
        trigger="loop"
        colors="primary:#9a0002,secondary:#efe6dd"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

/** Full-page loading overlay */
export function LoadingOverlay({ message = "Loading…" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size={56} />
      <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
