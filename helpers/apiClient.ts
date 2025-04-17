// lib/apiClient.ts
import axios from "axios";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", timezone: userTimeZone },
});

// Add a custom flag to skip retry logic on public API requests
export const refreshAccessToken = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true;
  } catch (error: any) {
    return false;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.warn("⛔ Interceptor caught error:", {
      status,
      url: originalRequest?.url,
      _retry: originalRequest?._retry,
    });

    const isRefreshRequest = originalRequest.url === "/auth/refresh-token";

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      console.log("🔁 Access token might be expired. Trying to refresh...");

      originalRequest._retry = true;
      const success = await refreshAccessToken();

      if (success) {
        console.log("✅ Token refresh successful. Retrying original request:", originalRequest.url);
        return apiClient(originalRequest);
      } else {
        console.warn("❌ Refresh token failed. User might need to log in again.");
        return Promise.reject({ isAuthError: true });
      }
    }

    console.error("🚫 Request failed and was NOT retried:", {
      url: originalRequest?.url,
      error: error?.response?.data || error.message,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
