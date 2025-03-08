import { apiRequest } from "./apiService";

export const createAdminNote = (noteData) => apiRequest("POST", "/admin-notes", noteData);
export const getAdminNoteByReportId = (id_report) => apiRequest('GET', `/admin-notes/${id_report}`);
