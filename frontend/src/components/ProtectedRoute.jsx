import React from "react";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#efe6dd" }}>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "#3d2b1f" }}>Session expired. Please log in again.</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="mt-4 rounded-xl px-6 py-2.5 text-white font-semibold cursor-pointer"
            style={{ background: "#9a0002" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const userRoles = (user.roles || []).map((r) => (typeof r === "object" ? r.name : r));
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    const isAdmin = userRoles.includes("ROLE_HR_ADMIN");
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#efe6dd" }}>
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#fee2e2" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#3d2b1f" }}>Access Denied</h2>
          <p className="text-sm mb-6" style={{ color: "#8b7355" }}>
            {isAdmin
              ? "You are logged in as an admin. This area is for employees only."
              : "You do not have permission to access the admin area."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl px-6 py-2.5 text-white font-semibold cursor-pointer"
            style={{ background: "#9a0002" }}
          >
            Go to your Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
