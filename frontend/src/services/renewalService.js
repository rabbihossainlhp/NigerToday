import { apiRequest } from "./apiClient";

export const renewalService = {
  create(renewal) {
    return apiRequest("/renewals/new", { method: "POST", body: renewal });
  },

  async listByCustomer(customerId) {
    const renewals = await apiRequest(
      `/renewals/customer/${encodeURIComponent(customerId)}`,
    );
    return Array.isArray(renewals) ? renewals : [];
  },

  getById(id) {
    return apiRequest(`/renewals/${encodeURIComponent(id)}`);
  },

  remove(id) {
    return apiRequest(`/renewals/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
