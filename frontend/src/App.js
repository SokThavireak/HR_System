import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { authService } from './services/authService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading-screen">Loading HRMS...</div>;

  if (!user) return <LoginPage onLogin={setUser} />;

  const isAdmin = user.roles?.includes('ROLE_HR_ADMIN');
  return isAdmin ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />;
}
