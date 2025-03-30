import { apiRequest } from './apiService';

// Admin login and store token
export const login = async (email, password) => {
  const res = await apiRequest('POST', '/admin/login', { email, password });
  const token = res.token;

  if (token) {
    localStorage.setItem('adminToken', token);
  }

  return res;
};

// Logout
export const logout = () => {
  localStorage.removeItem('adminToken');
  sessionStorage.removeItem('is_authenticated');
  sessionStorage.removeItem('user');
};

// Get stored token (if needed elsewhere)
export const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Request password reset link
export const requestPasswordReset = async (email) => {
  return await apiRequest('POST', '/admin/forgot-password', { email });
};

// Submit new password using token
export const resetPassword = async (token, newPassword) => {
  return await apiRequest('POST', `/admin/reset-password/${token}`, { newPassword });
};
