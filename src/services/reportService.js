import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/reports"; // Your backend URL

/**
 * Create a new report in the database.
 * @param {Object} reportData - The report details to send.
 * @returns {Promise<Object>} - The response from the backend.
 */
export const createReport = async (formData) => {
    try {
        const response = await axios.post(API_BASE_URL, formData);
        return response.data; // Returns the generated report_code
    } catch (error) {
        console.error("❌ Error creating report:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get a report by its report_code.
 * @param {string} reportCode - The unique report code.
 * @returns {Promise<Object>} - The report details.
 */
export const getReportByCode = async (reportCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${reportCode}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching report:", error.response?.data || error.message);
        throw error;
    }
};
