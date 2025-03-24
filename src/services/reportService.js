import { apiRequest } from "./apiService";
import { API_BASE_URL } from "./apiService";

export const createReport = (formData) => 
  apiRequest("POST", "/reports", formData);

export const getAllReports = () => 
  apiRequest("GET", "/reports");

export const getReportByCode = (report_code) => 
  apiRequest("GET", `/reports/${report_code}`);

export const updateReportStatus = (reportCode, newStatus) => 
  apiRequest("PUT", `/reports/${reportCode}/status`, { status: newStatus });

export const getStatusHistoryByReportId = (reportId) => 
  apiRequest("GET", `/status-history/${reportId}`); 

export const downloadReportCSV = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/export`, {
      method: "GET",
      headers: {
        "Content-Type": "text/csv",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download CSV");
    }

    return await response.blob();
  } catch (error) {
    console.error("❌ Error downloading CSV:", error);
    throw error;
  }
};
