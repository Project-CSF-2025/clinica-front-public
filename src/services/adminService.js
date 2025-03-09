import { apiRequest } from "./apiService";

export const toggleReportFlag = async (id_report, is_flagged) => {
  return apiRequest("PUT", `/reports/toggle-flag/${id_report}`, { is_flagged });
};
