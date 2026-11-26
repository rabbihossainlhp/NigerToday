import { apiRequest } from "./apiClient";

export const dashboardService = {
  getStats: () => apiRequest("/dashboard/stats"),
};
