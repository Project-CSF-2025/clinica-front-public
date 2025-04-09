import { apiRequest } from "./apiService";

export const getMessagesByReportId = async (reportId) => {
  return await apiRequest("GET", `/messages/${reportId}`);
};

export const sendMessage = async (messageData) => {
  return await apiRequest("POST", "/messages", messageData);
};

export const markMessagesAsRead = async (reportId) => {
  return await apiRequest("PUT", `/messages/mark-read/${reportId}`, {});
};

export const markAdminMessagesAsRead = async (reportCode) => {
  return await apiRequest("PUT", `/messages/mark-read-admin/${reportCode}`, {});
};


