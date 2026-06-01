import { useState, useEffect } from "react";
import { ShaderAnimation } from "./shader-animation";

export default function LoadingPage() {
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [systemIndex, setSystemIndex] = useState(0);
  const welcomeText = "WELCOME";
  const systemText = "HR SYSTEM";

  useEffect(() => {
    if (welcomeIndex < welcomeText.length) {
      const timer = setTimeout(() => setWelcomeIndex((i) => i + 1), 120);
      return () => clearTimeout(timer);
    }
    if (systemIndex < systemText.length) {
      const timer = setTimeout(() => setSystemIndex((i) => i + 1), 80);
      return () => clearTimeout(timer);
    }
  }, [welcomeIndex, systemIndex]);

  const isTyping = welcomeIndex < welcomeText.length || systemIndex < systemText.length;

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden"
      style={{ background: "#9a0002" }}
    >
      {/* Shader background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ShaderAnimation theme="dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Signature line accent */}
        <svg width="200" height="12" viewBox="0 0 200 12" className="mb-4" style={{ opacity: 0.3 }}>
          <path d="M2 8 C40 2, 80 2, 100 6 C120 10, 160 10, 198 4" fill="none" stroke="#efe6dd" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Typing text */}
        <div className="flex flex-col items-center gap-2">
          <h1
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
              fontSize: "8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, #efe6dd 0%, #ffffff 40%, #efe6dd 80%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmerText 2.5s linear infinite",
              lineHeight: 1.2,
              margin: 0,
              padding: 0,
            }}
          >
            {welcomeText.slice(0, welcomeIndex)}
            {welcomeIndex < welcomeText.length && (
              <span style={{ WebkitTextFillColor: "#efe6dd", animation: "blink 0.6s step-end infinite", fontFamily: "'Dancing Script', cursive" }}>|</span>
            )}
          </h1>

          <h2
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
              fontSize: "6.4rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, #efe6dd 0%, #ffffff 40%, #efe6dd 80%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmerText 2.5s linear infinite",
              lineHeight: 1.2,
              margin: 0,
              padding: 0,
            }}
          >
            {systemText.slice(0, systemIndex)}
            {isTyping && welcomeIndex >= welcomeText.length && systemIndex < systemText.length && (
              <span style={{ WebkitTextFillColor: "#efe6dd", animation: "blink 0.6s step-end infinite", fontFamily: "'Dancing Script', cursive" }}>|</span>
            )}
          </h2>
        </div>

        {/* Signature line accent bottom */}
        <svg width="200" height="12" viewBox="0 0 200 12" className="mt-6" style={{ opacity: 0.3 }}>
          <path d="M198 4 C160 10, 120 10, 100 6 C80 2, 40 2, 2 8" fill="none" stroke="#efe6dd" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Loading dots */}
        {isTyping && (
          <div className="mt-8 flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#efe6dd", animation: "bounce 0.6s ease-in-out infinite" }} />
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#efe6dd", animation: "bounce 0.6s ease-in-out 0.15s infinite" }} />
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#efe6dd", animation: "bounce 0.6s ease-in-out 0.3s infinite" }} />
          </div>
        )}
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
