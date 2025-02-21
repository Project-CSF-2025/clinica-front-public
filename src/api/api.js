import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Generic function to handle API requests
const apiRequest = async (method, endpoint, data = null) => {
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`, // Ensures all requests go to /api/
            data,
        });
        return response.data;
    } catch (error) {
        console.error(`Error ${method.toUpperCase()} ${endpoint}:`, error.response ? error.response.data : error.message);
        return null;
    }
};

// ====== USERS API ======
export const getUsers = () => apiRequest('GET', '/users');
export const getUserById = (id) => apiRequest('GET', `/users/${id}`);
export const createUser = (userData) => apiRequest('POST', '/users', userData);

// ====== REPORTS API ======
export const getReports = () => apiRequest('GET', '/reports');
export const getReportById = (id_report) => apiRequest('GET', `/reports/${id_report}`);
export const createReport = (data) => apiRequest('POST', '/reports', data);
export const updateReport = (id_report, reportData) => apiRequest('PUT', `/reports/${id_report}`, reportData);
export const deleteReport = (id_report) => apiRequest('DELETE', `/reports/${id_report}`);

// ====== MESSAGES API ======
export const getMessagesByReportId = (id_report) => apiRequest('GET', `/messages/${id_report}`);
export const createMessage = (messageData) => apiRequest('POST', '/messages', messageData);
