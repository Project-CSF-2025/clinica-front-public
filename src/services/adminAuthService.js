import { apiRequest } from './apiService';

// 🔐 Admin login and store token
export const login = async (email, password) => {
  const res = await apiRequest('POST', '/admin/login', { email, password });
  const token = res.token;

  if (token) {
    localStorage.setItem('adminToken', token);
  }

  return res;
};

// 🔓 Logout
export const logout = () => {
  localStorage.removeItem('adminToken');
  sessionStorage.removeItem('is_authenticated');
  sessionStorage.removeItem('user');
};

// 📦 Get stored token (if needed elsewhere)
export const getToken = () => {
  return localStorage.getItem('adminToken');
};
