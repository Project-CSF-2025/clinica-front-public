import { apiRequest } from "./apiService";

export const createReport = (formData) => apiRequest("POST", "/reports", formData);
export const getAllReports = () => apiRequest("GET", "/reports");
export const getReportByCode = (reportCode) => apiRequest("GET", `/reports/${reportCode}`);
