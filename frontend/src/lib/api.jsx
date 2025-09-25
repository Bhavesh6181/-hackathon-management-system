import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: (data) => api.post('/auth/demo-login', data),
  verifyToken: (token) => api.post('/auth/verify', { token }),
};

// Hackathons API
export const hackathonsAPI = {
  getAll: (params) => api.get('/hackathons', { params }),
  getById: (id) => api.get(`/hackathons/${id}`),
  create: (data) => api.post('/hackathons', data),
  update: (id, data) => api.put(`/hackathons/${id}`, data),
  delete: (id) => api.delete(`/hackathons/${id}`),
  register: (id) => api.post(`/hackathons/${id}/register`),
  registerTeam: (id, teamData) => api.post(`/hackathons/${id}/register-team`, teamData),
  unregister: (id) => api.post(`/hackathons/${id}/unregister`),
  getMyHackathons: () => api.get('/hackathons/user/my-hackathons'),
  approve: (id) => api.post(`/hackathons/${id}/approve`),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Feedback API
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
};

export default api;

