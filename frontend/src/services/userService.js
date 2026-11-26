import { apiRequest } from "./apiClient";

export const userService = {
  async getProfile() {
    const result = await apiRequest("/users/self/in");
    return result.user || result;
  },

  async updateProfile(profile) {
    const result = await apiRequest("/users/self/update", {
      method: "PATCH",
      body: profile,
    });
    return result.user || result;
  },

  changePassword(oldPassword, newPassword) {
    return apiRequest("/auth/change-password", {
      method: "POST",
      body: { oldPassword, newPassword },
    });
  },
};
