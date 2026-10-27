import axios from 'axios';

/* Configure API Base URL:
   Supports REACT_APP_API_URL or VITE_API_URL with automatic /api/v1 normalization */
const rawUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || '';
const cleanUrl = rawUrl.replace(/\/+$/, '');
const API_BASE = cleanUrl ? (cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`) : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 second timeout — accommodates Render cold start spin-up delays
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hasToken = !!localStorage.getItem('hrms_token');
      const isLoginRequest = err.config?.url?.includes('/auth/login');

      localStorage.removeItem('hrms_token');
      localStorage.removeItem('hrms_user');
      localStorage.removeItem('hrms_login_time');
      localStorage.removeItem('hrms_role');

      if (hasToken && !isLoginRequest) {
        window.location.reload();
      }
    }
    // Wrap response data in an Error so .message always works
    const data = err.response?.data;
    if (data && typeof data === "object") {
      const msg = data.message || data.error || JSON.stringify(data);
      const wrap = new Error(msg);
      wrap.status = err.response?.status;
      wrap.data = data;
      return Promise.reject(wrap);
    }
    return Promise.reject(data ? new Error(String(data)) : err);
  }
);

export default api;
