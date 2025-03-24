import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Generic function for making API requests with optional auth support.
 * @param {string} method - The HTTP method (GET, POST, etc.).
 * @param {string} endpoint - The API endpoint (e.g., "/users").
 * @param {Object} [data=null] - Request payload.
 * @param {Object} [customHeaders={}] - Optional additional headers.
 * @returns {Promise<Object>} - The API response.
 */
export const apiRequest = async (method, endpoint, data = null, customHeaders = {}) => {
    const token = localStorage.getItem("adminToken");

    const headers = {
        "Content-Type": "application/json",
        ...customHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            headers,
        });
        return response.data;
    } catch (error) {
        console.error(`❌ API Error (${method.toUpperCase()} ${endpoint}):`, error.response?.data || error.message);
        throw error;
    }
};
