import { apiRequest } from "./apiService";

export const getMessagesByReportId = async (reportId) => {
  return await apiRequest("GET", `/messages/${reportId}`);
};

export const sendMessage = async (messageData) => {
  return await apiRequest("POST", "/messages", messageData);
};
