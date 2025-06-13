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
  
  verifyOTP: (email, otp) => 
    api.post('/auth/verify-otp', { email, otp }),
  
  signup: (data) => 
    api.post('/auth/signup', data),
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

export default api;