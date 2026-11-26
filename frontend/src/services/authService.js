import { apiRequest, clearAuth, getAuth, setAuth } from "./apiClient";

export const authService = {
  async login(email, password) {
    const result = await apiRequest(
      "/auth/login",
      { method: "POST", body: { email, password }, auth: false },
      false,
    );
    const user = result.user;
    const tokens = result.tokens;
    if (user?.role !== "admin") {
      throw new Error("This account does not have administrator access.");
    }
    if (!tokens?.access?.token || !tokens?.refresh?.token) {
      throw new Error("The server did not return valid login tokens.");
    }

    setAuth({
      loggedIn: true,
      user: {
        id: user.id || user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token,
    });
    return user;
  },

  async logout() {
    const refreshToken = getAuth()?.refreshToken;
    try {
      if (refreshToken) {
        await apiRequest(
          "/auth/logout",
          { method: "POST", body: { refreshToken } },
          false,
        );
      }
    } finally {
      clearAuth();
    }
  },
};
