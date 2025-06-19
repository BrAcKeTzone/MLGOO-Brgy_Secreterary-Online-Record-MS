import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEV,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API endpoints
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  requestOTP: (email) => 
    api.post('/auth/request-otp', { email }),
  
  verifyEmailOtp: (email, otp) => 
    api.post('/auth/verify-email-otp', { email, otp }),
  
  checkEmail: (email) => 
    api.post('/auth/check-email', { email }),

  requestPasswordReset: (email) => 
    api.post('/auth/request-password-reset', { email }),
  
  verifyPasswordResetOtp: (email, otp) => 
    api.post('/auth/verify-password-reset-otp', { email, otp }),
  
  resetPassword: (email, newPassword) => 
    api.post('/auth/reset-password', { email, newPassword }),
  
  signup: (formData) => {
    const data = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      role: formData.role,
      validIDFrontUrl: null, // Will be updated after file upload
      validIDFrontPublicId: null,
      validIDBackUrl: null,
      validIDBackPublicId: null
    };
    return api.post('/auth/signup', data);
  },
  
  getCurrentUser: () => api.get('/auth/me')
};

// Barangay API endpoints
export const brgyAPI = {
  fetchBarangays: () => api.get('/barangays'),
  getBarangay: (id) => api.get(`/barangays/${id}`),
};

// Role API endpoints
export const roleAPI = {
  fetchRoles: () => api.get('/roles'),
  getRole: (id) => api.get(`/roles/${id}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  fetchMetrics: () => api.get('/dashboard/metrics'),
  fetchActivityData: () => api.get('/dashboard/activity'),
};

// Home API endpoints
export const homeAPI = {
  fetchActivities: () => api.get('/home/activities'),
  fetchNotifications: () => api.get('/home/notifications'),
}

// User Management API endpoints
export const userAPI = {
  fetchUsers: () => api.get('/users'),
  updateUserStatus: (userId, status) => 
    api.patch(`/users/${userId}/status`, { status }),
  deleteUser: (userId) => 
    api.delete(`/users/${userId}`),
  updateUser: (userId, data) => 
    api.put(`/users/${userId}`, data),
};

// Logs API endpoints
export const logsAPI = {
  fetchLogs: () => api.get('/logs'),
  searchLogs: (filters) => api.post('/logs/search', filters),
};

export const profileAPI = {
  getProfile: () => 
    api.get('/profile'),
  
  changePassword: (currentPassword, newPassword) => 
    api.post('/profile/change-password', { currentPassword, newPassword })
};

export const settingsAPI = {
  fetchBarangays: () => api.get('/settings/barangays'),
  updateBarangay: (id, updates) => api.put(`/settings/barangays/${id}`, updates),
  createBarangay: (barangay) => api.post('/settings/barangays', barangay),
  deleteBarangay: (id) => api.delete(`/settings/barangays/${id}`),


  fetchReportTypes: () => api.get('/settings/report-types'),
  updateReportType: (id, updates) => api.put(`/settings/report-types/${id}`, updates),
  createReportType: (reportType) => api.post('/settings/report-types', reportType),
  deleteReportType: (id) => api.delete(`/settings/report-types/${id}`),

  fetchPrivacyPolicy: () => api.get('/settings/privacy-policy'),
  updatePrivacyPolicy: (updates) => api.put('/settings/privacy-policy', { updates }),

  fetchTermsOfService: () => api.get('/settings/terms-of-service'),
  updateTermsOfService: (updates) => api.put('/settings/terms-of-service', { updates }),
};

export default api;