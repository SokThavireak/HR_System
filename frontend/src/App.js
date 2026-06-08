import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LoadingPage from './components/ui/loading-page';
import { authService } from './services/authService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('hrms_token');
    const loginTime = localStorage.getItem('hrms_login_time');
    const role = localStorage.getItem('hrms_role');

    if (token) {
      // Check expiry: admin = 8 hours, employee = forever
      if (loginTime && role === 'admin') {
        const elapsed = Date.now() - Number(loginTime);
        const eightHours = 8 * 60 * 60 * 1000;
        if (elapsed > eightHours) {
          // Admin session expired
          localStorage.removeItem('hrms_token');
          localStorage.removeItem('hrms_user');
          localStorage.removeItem('hrms_login_time');
          localStorage.removeItem('hrms_role');
          setLoading(false);
          return;
        }
      }

      authService.getCurrentUser()
        .then((u) => {
          // Normalize roles: API returns Role objects, but we need string names
          if (u?.roles?.length && typeof u.roles[0] === 'object') {
            u.roles = u.roles.map((r) => r.name || r);
          }
          setUser(u);
        })
        .catch(() => {
          try {
            const saved = localStorage.getItem('hrms_user');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.roles?.length && typeof parsed.roles[0] === 'object') {
                parsed.roles = parsed.roles.map((r) => r.name || r);
              }
              setUser(parsed);
              return;
            }
          } catch (e) {}
          localStorage.removeItem('hrms_token');
          localStorage.removeItem('hrms_user');
          localStorage.removeItem('hrms_login_time');
          localStorage.removeItem('hrms_role');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
      </div>
    </div>
  );

  if (loadingPage) return <LoadingPage />;

  if (!user) return <LoginPage onLogin={(data) => {
    setLoadingPage(true);
    try {
      localStorage.setItem('hrms_user', JSON.stringify(data));
      localStorage.setItem('hrms_login_time', String(Date.now()));
      const isAdmin = data.roles?.includes('ROLE_HR_ADMIN');
      localStorage.setItem('hrms_role', isAdmin ? 'admin' : 'employee');
    } catch(e) {}
    setTimeout(() => { setUser(data); setLoadingPage(false); }, 2000);
  }} />;

  const isAdmin = user.roles?.includes('ROLE_HR_ADMIN');
  return isAdmin ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />;
}
