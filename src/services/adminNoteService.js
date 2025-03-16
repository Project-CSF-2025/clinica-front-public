import { apiRequest } from "./apiService";

export const createAdminNote = (noteData) => 
  apiRequest("POST", "/admin-notes", noteData);

export const getAllAdminNotes = () => 
  apiRequest("GET", "/admin-notes"); 

export const getAdminNoteByReportId = (id_report) => 
  apiRequest('GET', `/admin-notes/${id_report}`);

export const updateAdminNote = (noteId, memoData) =>
  apiRequest("PUT", `/admin-notes/${noteId}`, memoData);

export const softDeleteAdminNote = (noteId) =>
  apiRequest("DELETE", `/admin-notes/${noteId}`);