import api from './api';

export const adminService = {
  getUsers: (search, page = 0, size = 10) =>
    api.get('/admin/users', { params: { search, page, size } }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deactivateUser: (id) => api.delete(`/admin/users/${id}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

  getAttendance: (from, to, userId, page = 0) =>
    api.get('/admin/attendance', { params: { from, to, userId, page } }),

  getLeaves: (status, page = 0) => api.get('/admin/leaves', { params: { status, page } }),
  approveLeave: (id) => api.put(`/admin/leaves/${id}/approve`),
  rejectLeave: (id, reason) => api.put(`/admin/leaves/${id}/reject`, { rejectionReason: reason }),

  calculatePayroll: (data) => api.post('/admin/payroll/calculate', data),
  getPayrolls: (page = 0) => api.get('/admin/payroll', { params: { page } }),
  createPayroll: (data) => api.post('/admin/payroll', data),
  processPayroll: (id) => api.put(`/admin/payroll/${id}/process`),
  payPayroll: (id) => api.put(`/admin/payroll/${id}/pay`),

  getReviews: (page = 0) => api.get('/admin/performance', { params: { page } }),
  createReview: (data) => api.post('/admin/performance', data),
  updateReview: (id, data) => api.put(`/admin/performance/${id}`, data),
  deleteReview: (id) => api.delete(`/admin/performance/${id}`),

  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};
