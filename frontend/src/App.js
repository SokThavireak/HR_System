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
    if (token) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('hrms_token'))
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

  if (!user) return <LoginPage onLogin={(data) => { setLoadingPage(true); setTimeout(() => { setUser(data); setLoadingPage(false); }, 2000); }} />;

  const isAdmin = user.roles?.includes('ROLE_HR_ADMIN');
  return isAdmin ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />;
}
