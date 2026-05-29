import axios from 'axios';

/* Dev: use "proxy" from package.json → localhost:8080.
   Prod: override with REACT_APP_API_URL or fall back to relative /api/v1. */
const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
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
      localStorage.removeItem('hrms_token');
      window.location.reload();
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;
