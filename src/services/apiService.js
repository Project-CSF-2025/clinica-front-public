import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

/**
 * Generic function for making API requests.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} endpoint - The API endpoint (e.g., "/users").
 * @param {Object} [data=null] - Request payload (for POST/PUT).
 * @returns {Promise<Object>} - The API response.
 */
export const apiRequest = async (method, endpoint, data = null) => {
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
        });
        return response.data;
    } catch (error) {
        console.error(`❌ API Error (${method.toUpperCase()} ${endpoint}):`, error.response?.data || error.message);
        throw error;
    }
};
