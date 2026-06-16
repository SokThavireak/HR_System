import React, { useState } from "react";
import { authService } from "../services/authService";
import { Button, Input, Label, LoginLoader } from "../components/ui";
import { ShaderAnimation } from "../components/ui/shader-animation";
import { ScrollReveal, StaggerItem } from "../components/ui/staggered-reveal";

/* ─── Icons ─── */
const icons = {
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  homeSm: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  shield: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  heart: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  sparkle: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  sparkleLg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  quote: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 shrink-0 text-white/30"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>,
};

/* ─── Testimonial Data ─── */
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "HR Director @ TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "This HRMS transformed how we manage our 500+ employee workforce. The attendance tracking is seamless.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Engineering Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Clocking in has never been easier. The UI is clean and the payroll features save us hours every month.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Operations Lead",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "Best HR tool we've used. The leave management and performance review modules are game-changers.",
    rating: 5,
  },
];

/* ─── Feature Pills ─── */
const FEATURES = [
  { icon: icons.shield, label: "Enterprise Security" },
  { icon: icons.zap, label: "Instant Sync" },
  { icon: icons.sparkle, label: "Smart Automation" },
  { icon: icons.heart, label: "Employee First" },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem("hrms_token", data.token);
      
      // Fetch full user details to ensure all profile fields are available immediately
      try {
        const userRes = await authService.getCurrentUser();
        onLogin({ ...data, ...userRes.data });
      } catch (e) {
        onLogin(data);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Wake up the backend on mount (Render cold-start optimization)
  React.useEffect(() => {
    authService.getCurrentUser().catch(() => {});
  }, []);

  // Auto-cycle testimonials every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  if (loading) return <LoginLoader />;

  const t = TESTIMONIALS[currentTestimonial];

  return (
    <div className="flex h-[100dvh] w-[100dvw] overflow-hidden login-page-container">
      {/* ═══════════ LEFT: Hero / Shader Background ═══════════ */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden md:flex login-left-pane">
        <ShaderAnimation theme="dark" />
        <div className="absolute inset-0 bg-[#9a0002]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-red-950/50 pointer-events-none" />

        {/* Content layer */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 lg:p-14 text-white">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-white/5" />

          {/* Logo */}
          <StaggerItem>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                {icons.home}
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">HRMS</span>
                <p className="text-[11px] font-medium text-white/50">Human Resource Management</p>
              </div>
            </div>
          </StaggerItem>

          {/* Hero Copy */}
          <div className="relative z-10 -mt-8">
            <StaggerItem>
              <h1 className="mb-4 text-[2.5rem] font-extrabold leading-[1.1] tracking-tight lg:text-5xl">
                Manage Your
                <br />
                <span className="inline-flex items-center gap-2">
                  Team <span className="text-yellow-300">{icons.sparkleLg}</span> Better
                </span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="max-w-sm text-base leading-relaxed text-white/65">
                A modern, intuitive platform for attendance, payroll, leaves, and performance — all in one place.
              </p>
            </StaggerItem>

            {/* Feature pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {FEATURES.map((f, i) => (
                <StaggerItem key={f.label}>
                  <div
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm"
                    style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  >
                    {f.icon}
                    {f.label}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="relative z-10 testimonial-section">
            <StaggerItem>
              <div key={t.id} className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm animate-testimonial">
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-300">{icons.sparkle}</span>
                  ))}
                </div>
                <div className="mb-4 flex items-start gap-2">
                  {icons.quote}
                  <p className="text-sm leading-relaxed text-white/80">{t.quote}</p>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 rounded-full border-2 border-white/20 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Testimonial Dots */}
            <div className="mt-4 flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentTestimonial
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT: Sign-In Form ═══════════ */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-10 login-right-pane" style={{ background: "#efe6dd" }}>
        <ScrollReveal variant="fadeUp" stagger={0.1} delay={0.05} className="w-full max-w-[400px] py-4">
          {/* Mobile Logo */}
          <StaggerItem>
            <div className="mb-8 flex items-center justify-center gap-2 md:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                {icons.homeSm}
              </div>
              <span className="text-xl font-bold tracking-tight">HRMS</span>
            </div>
          </StaggerItem>

          {/* Header */}
          <StaggerItem>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to access your dashboard
              </p>
              <div className="mt-4 rounded-xl border border-primary/10 bg-primary/[0.03] p-3 text-left text-[11px] leading-relaxed">
                <p className="font-semibold text-primary flex items-center gap-1.5 mb-2">
                  🔑 Demo Accounts
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">HR Viewer (Read-Only):</span>
                    <p className="mt-0.5">Email: <code className="font-mono font-semibold text-foreground bg-white/60 px-1 py-0.5 rounded">viewer@hrms.local</code></p>
                    <p>Password: <code className="font-mono font-semibold text-foreground bg-white/60 px-1 py-0.5 rounded">123456789</code></p>
                  </div>
                  <div className="border-t border-primary/5 pt-2">
                    <span className="font-semibold text-foreground">Employee (Full Access):</span>
                    <p className="mt-0.5">Email: <code className="font-mono font-semibold text-foreground bg-white/60 px-1 py-0.5 rounded">employee@hrms.local</code></p>
                    <p>Password: <code className="font-mono font-semibold text-foreground bg-white/60 px-1 py-0.5 rounded">123456789</code></p>
                  </div>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Error */}
          {error && (
            <StaggerItem>
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                <span>⚠️</span>
                {error}
              </div>
            </StaggerItem>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  placeholder="you@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? icons.eyeOff : icons.eye}
                  </button>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
              </div>
            </StaggerItem>

            <StaggerItem>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </StaggerItem>
          </form>

          {/* Footer */}
          <StaggerItem>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              🔐 Your data is protected with enterprise-grade security
            </p>
          </StaggerItem>

          {/* Stats Row */}
          <div className="mt-6 flex justify-center gap-6">
            {[
              { value: "500+", label: "Teams" },
              { value: "50K+", label: "Users" },
              { value: "99.9%", label: "Uptime" },
            ].map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
