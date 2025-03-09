import { apiRequest } from "./apiService";

export const createReport = (formData) => 
  apiRequest("POST", "/reports", formData);

export const getAllReports = () => 
  apiRequest("GET", "/reports");

export const getReportByCode = (report_code) => 
  apiRequest("GET", `/reports/${report_code}`);

export const updateReportStatus = (reportCode, newStatus) => 
  apiRequest("PUT", `/reports/${reportCode}/status`, { status: newStatus });