import React from "react";

export default function LoadingScreen({ variant = "admin", message }) {
  const portalLabel = variant === "admin" ? "Admin Portal" : "Employee Portal";
  const loadingMsg = message || "Loading your dashboard…";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "#efe6dd",
      }}
    >
      {/* Floating orbs */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          className="animate-floating-orb-1"
          style={{ position: "absolute", top: "20%", left: "15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(154,0,2,0.35), transparent 70%)", opacity: 0.25 }}
        />
        <div
          className="animate-floating-orb-2"
          style={{ position: "absolute", bottom: "20%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(154,0,2,0.3), transparent 70%)", opacity: 0.2 }}
        />
        <div
          className="animate-floating-orb-3"
          style={{ position: "absolute", top: "50%", left: "55%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(154,0,2,0.4), transparent 70%)", opacity: 0.15 }}
        />
      </div>

      {/* Centered content: position top/left 50% then translate back */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "100%" }}>
        {/* Logo */}
        <div
          className="animate-logo-breathe"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 24, background: "rgba(154,0,2,0.08)", marginBottom: 24 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9a0002" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "#9a0002", margin: 0, lineHeight: 1 }}>
          HRMS
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#999" }}>
          {portalLabel}
        </p>

        {/* Spinner bars */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, height: 32, marginTop: 24 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 6, borderRadius: 3, background: "#9a0002", animation: `loadingBar 1.2s ease-in-out ${i * 0.12}s infinite` }} />
          ))}
        </div>

        <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#999", animation: "loadingPulse 2s ease-in-out infinite" }}>
          {loadingMsg}
        </p>
      </div>
    </div>
  );
}
