import api from './api';

export const attendanceService = {
  /* ---------- Employee endpoints ---------- */
  clockIn: (data) => api.post('/employee/attendance/clock-in', data),
  clockOut: (data) => api.post('/employee/attendance/clock-out', data),
  getMyAttendance: (from, to) =>
    api.get('/employee/attendance', { params: { from, to } }),
  getToday: () => api.get('/employee/attendance/today'),
  getMyMonthly: (month, year) =>
    api.get('/employee/attendance/monthly', { params: { month, year } }),

  /* ---------- Admin endpoints ---------- */
  getAllAttendance: (from, to, userId, page = 0, size = 20) =>
    api.get('/admin/attendance', { params: { from, to, userId, page, size } }),
  getUserAttendance: (userId, from, to) =>
    api.get(`/admin/attendance/employee/${userId}`, {
      params: { from, to },
    }),
  addManualEntry: (data) => api.post('/admin/attendance/manual', data),
  updateAttendance: (id, data) =>
    api.put(`/admin/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/admin/attendance/${id}`),
  exportReport: (from, to, userId) =>
    api.get('/admin/attendance/export', {
      params: { from, to, userId },
      responseType: 'blob',
    }),
  getSummary: () => api.get('/admin/attendance/summary'),
};
