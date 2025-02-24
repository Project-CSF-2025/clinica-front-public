import { apiRequest } from "./apiService";

export const createReport = (formData) => apiRequest("POST", "/reports", formData);
export const getReportByCode = (reportCode) => apiRequest("GET", `/reports/${reportCode}`);
