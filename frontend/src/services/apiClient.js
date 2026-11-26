export const AUTH_STORAGE_KEY = "nigertoday_auth";
export const AUTH_CHANGED_EVENT = "nigertoday-auth-changed";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
let tokenRefreshPromise = null;

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

async function sendRequest(path, options, includeAuth) {
  const headers = new Headers(options.headers || {});
  if (includeAuth) {
    const token = getAuth()?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });
  const payload = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    const error = new Error(payload?.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return payload?.data?.attributes ?? payload?.data ?? payload;
}

export async function apiRequest(path, options = {}, canRefresh = true) {
  try {
    return await sendRequest(path, options, options.auth !== false);
  } catch (error) {
    if (error.status !== 401 || !canRefresh || options.auth === false) throw error;

    const refreshToken = getAuth()?.refreshToken;
    if (!refreshToken) {
      clearAuth();
      throw error;
    }

    if (!tokenRefreshPromise) {
      tokenRefreshPromise = (async () => {
        try {
          const result = await sendRequest(
            "/auth/refresh-tokens",
            { method: "POST", body: { refreshToken } },
            false,
          );
          const tokens = result.tokens;
          if (!tokens?.access?.token || !tokens?.refresh?.token) {
            throw new Error("The server returned invalid refreshed tokens.");
          }

          setAuth({
            ...getAuth(),
            accessToken: tokens.access.token,
            refreshToken: tokens.refresh.token,
          });
        } catch (refreshError) {
          clearAuth();
          throw refreshError;
        } finally {
          tokenRefreshPromise = null;
        }
      })();
    }

    await tokenRefreshPromise;
    return sendRequest(path, options, true);
  }
}
