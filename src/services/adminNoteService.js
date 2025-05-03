import { apiRequest } from "./apiService";

export const createAdminNote = (noteData) =>
  apiRequest("POST", "/admin-notes", noteData);

export const getAllAdminNotes = () =>
  apiRequest("GET", "/admin-notes");

export const getAdminNoteByReportId = (id_report) =>
  apiRequest("GET", `/admin-notes/${id_report}`);

export const updateAdminNote = (noteId, memoData) =>
  apiRequest("PUT", `/admin-notes/${noteId}`, memoData);

export const softDeleteAdminNote = async (noteId) => {
  try {
    return await apiRequest("PUT", `/admin-notes/${noteId}/delete`, {}); // ✅ send empty object
  } catch (error) {
    console.error("❌ Error soft-deleting admin note:", error);
    throw error;
  }
};




