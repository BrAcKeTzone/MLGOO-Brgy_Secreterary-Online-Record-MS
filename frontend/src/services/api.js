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
  
  // Added method to upload image files
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(
      `${import.meta.env.VITE_API_URL_DEV}/upload`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  
  // Updated signup method to include ID images
  signup: (formData) => {
    // Make sure we're sending all the required fields
    const data = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      role: formData.role,
      validIDTypeId: formData.validIDTypeId,
      // Include assignedBrgy only if it's provided
      ...(formData.assignedBrgy ? { assignedBrgy: formData.assignedBrgy } : {}),
      // Include ID document information
      ...(formData.nationalIdFront ? { nationalIdFront: formData.nationalIdFront } : {}),
      ...(formData.nationalIdBack ? { nationalIdBack: formData.nationalIdBack } : {})
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
  fetchUsers: (queryString = '') => 
    api.get(`/users?${queryString}`),
  getUserDetails: (userId) => 
    api.get(`/users/${userId}/details`),
  updateUserStatus: (userId, { status, activeStatus }) => 
    api.patch(`/users/${userId}/status`, { status, activeStatus }),
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
  // Valid ID Types
  fetchValidIDTypes: () => api.get('/settings/valid-id-types'),
  fetchActiveValidIDTypes: () => api.get('/settings/valid-id-types/active'),
  createValidIDType: (validIDType) => api.post('/settings/valid-id-types', validIDType),
  updateValidIDType: (id, updates) => api.put(`/settings/valid-id-types/${id}`, updates),
  deleteValidIDType: (id) => {
    console.log("API called to delete ID type:", id);
    return api.delete(`/settings/valid-id-types/${id}`)
      .then(response => {
        // If successful, return a resolved promise
        console.log("Delete successful, status:", response.status);
        return Promise.resolve({ success: true });
      });
  },
  toggleValidIDTypeStatus: (id) => api.patch(`/settings/valid-id-types/${id}/toggle`),
  
  // Barangays
  fetchBarangays: () => api.get('/settings/barangays'),
  updateBarangay: (id, updates) => api.put(`/settings/barangays/${id}`, updates),
  createBarangay: (barangay) => api.post('/settings/barangays', barangay),
  deleteBarangay: (id) => api.delete(`/settings/barangays/${id}`),

  // Report Types
  fetchReportTypes: () => api.get('/settings/report-types'),
  updateReportType: (id, updates) => api.put(`/settings/report-types/${id}`, updates),
  createReportType: (reportType) => api.post('/settings/report-types', reportType),
  deleteReportType: (id) => api.delete(`/settings/report-types/${id}`),

  // Privacy Policy
  fetchPrivacyPolicy: () => api.get('/settings/privacy-policy'),
  createPrivacyPolicySection: (sectionData) => api.post('/settings/privacy-policy', sectionData),
  updatePrivacyPolicySection: (id, updates) => api.put(`/settings/privacy-policy/${id}`, updates),
  deletePrivacyPolicySection: (id) => api.delete(`/settings/privacy-policy/${id}`),
  reorderPrivacyPolicySections: (sections) => api.post('/settings/privacy-policy/reorder', sections),

  // Terms of Service
  fetchTermsOfService: () => api.get('/settings/terms-of-service'),
  createTermsOfServiceSection: (sectionData) => api.post('/settings/terms-of-service', sectionData),
  updateTermsOfServiceSection: (id, updates) => api.put(`/settings/terms-of-service/${id}`, updates),
  deleteTermsOfServiceSection: (id) => api.delete(`/settings/terms-of-service/${id}`),
  reorderTermsOfServiceSections: (sections) => api.post('/settings/terms-of-service/reorder', sections),
};

export default api;