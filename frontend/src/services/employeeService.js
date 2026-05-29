import api from './api';

export const employeeService = {
  // Attendance
  clockIn:  (data) => api.post('/employee/attendance/clock-in', data),
  clockOut: (data) => api.post('/employee/attendance/clock-out', data),
  getMyAttendance: (from, to) => api.get('/employee/attendance', { params: { from, to } }),
  getToday: () => api.get('/employee/attendance/today'),

  // Leaves
  getMyLeaves: () => api.get('/employee/leaves'),
  requestLeave: (data) => api.post('/employee/leaves', data),
  cancelLeave: (id) => api.delete(`/employee/leaves/${id}`),

  // Profile & Reports
  getDashboardSummary: () => api.get('/employee/dashboard/summary'),
  getPaySlips: () => api.get('/employee/payslips'),
  downloadPaySlip: (id) => api.get(`/employee/payslips/${id}/download`, { responseType: 'blob' }),
  getPerformance: () => api.get('/employee/performance'),
  getProfile: () => api.get('/employee/profile'),
  updateProfile: (data) => api.put('/employee/profile', data),
};
