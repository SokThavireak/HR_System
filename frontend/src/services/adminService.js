import api from './api';

/* ================================================================
   adminService — Full CRUD for User, Leave, Payroll, Performance
   ================================================================ */

export const adminService = {
  /* =================================================================
     USERS  —  list · get · create · update · deactivate · role · reset
     ================================================================= */
  getUsers: (search, page = 0, size = 10) =>
    api.get('/admin/users', { params: { search, page, size } }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deactivateUser: (id) => api.delete(`/admin/users/${id}`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  resetPassword: (id, newPassword) =>
    api.put(`/admin/users/${id}/reset-password`, { newPassword }),

  /* =================================================================
     LEAVES  —  list · get · approve · reject · cancel
     ================================================================= */
  getLeaves: (status, page = 0, size = 20) =>
    api.get('/admin/leaves', { params: { status, page, size } }),
  getLeave: (id) => api.get(`/admin/leaves/${id}`),
  approveLeave: (id) => api.put(`/admin/leaves/${id}/approve`),
  rejectLeave: (id, reason) =>
    api.put(`/admin/leaves/${id}/reject`, { rejectionReason: reason }),
  cancelLeave: (id) => api.put(`/admin/leaves/${id}/cancel`),
  updateLeave: (id, data) => api.put(`/admin/leaves/${id}`, data),
  getLeaveBalance: (userId) => api.get(`/admin/leaves/balance/${userId}`),
  updateLeaveBalance: (userId, data) => api.put(`/admin/leaves/balance/${userId}`, data),

  /* =================================================================
     PAYROLL  —  list · get · calculate · create · process · pay · delete
     ================================================================= */
  getPayrolls: (page = 0, size = 200, userId, status) =>
    api.get('/admin/payroll', { params: { page, size, userId, status } }),
  getPayroll: (id) => api.get(`/admin/payroll/${id}`),
  calculatePayroll: (data) => api.post('/admin/payroll/calculate', data),
  getAttendanceSummary: (userId, start, end) =>
    api.get('/admin/attendance/summary', { params: { userId, start, end } }),
  createPayroll: (data) => api.post('/admin/payroll', data),
  updatePayroll: (id, data) => api.put(`/admin/payroll/${id}`, data),
  processPayroll: (id) => api.put(`/admin/payroll/${id}/process`),
  payPayroll: (id) => api.put(`/admin/payroll/${id}/pay`),
  deletePayroll: (id) => api.delete(`/admin/payroll/${id}`),
  bulkProcess: () => api.post('/admin/payroll/bulk-process'),

  /* =================================================================
     PERFORMANCE  —  list · get · create · update · delete · export
     ================================================================= */
  getReviews: (page = 0, size = 20, employeeId) =>
    api.get('/admin/performance', { params: { page, size, employeeId } }),
  getReview: (id) => api.get(`/admin/performance/${id}`),
  createReview: (data) => api.post('/admin/performance', data),
  updateReview: (id, data) => api.put(`/admin/performance/${id}`, data),
  deleteReview: (id) => api.delete(`/admin/performance/${id}`),
  getEmployeePerformance: (employeeId) =>
    api.get('/admin/performance', { params: { employeeId } }),

  /* =================================================================
     DASHBOARD STATS
     ================================================================= */
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  /* =================================================================
	   DEPARTMENTS  —  list · get · create · update · delete
	   ================================================================= */
  getDepartments: (search, page = 0, size = 50) =>
    api.get('/admin/departments', { params: { search, page, size } }),
  getDepartmentList: () => api.get('/admin/departments/list'),
  getDepartment: (id) => api.get(`/admin/departments/${id}`),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),

  /* =================================================================
	   POSITIONS  —  list · get · create · update · delete
	   ================================================================= */
  getPositions: (departmentId, page = 0, size = 50) =>
    api.get('/admin/positions', { params: { departmentId, page, size } }),
  getPositionList: (departmentId) =>
    api.get('/admin/positions/list', { params: { departmentId } }),
  getPosition: (id) => api.get(`/admin/positions/${id}`),
  createPosition: (data) => api.post('/admin/positions', data),
  updatePosition: (id, data) => api.put(`/admin/positions/${id}`, data),
  deletePosition: (id) => api.delete(`/admin/positions/${id}`),
};
