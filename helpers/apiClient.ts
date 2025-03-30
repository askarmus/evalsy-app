import { addToast } from "@heroui/react";
import axios from "axios";
import Router from "next/router";

// Create Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ For cookie-based auth
});

// ✅ Token refresh helper
export const refreshAccessToken = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("Refresh token expired or invalid.");
        return false;
      }
      console.error("Unexpected Axios error during refresh:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unknown error during token refresh:", error);
    }
    return false;
  }
};

// ✅ Add timezone to each request
apiClient.interceptors.request.use(
  (config) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers["timezone"] = userTimeZone;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Retry config
const MAX_RETRIES = 3;

// ✅ Global response handling with retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || "An unexpected error occurred.";

    // ✅ Handle login failure separately
    if (originalRequest.url?.includes("/auth/login") && status === 401) {
      addToast({
        description: "Invalid email or password. Please try again.",
        color: "danger",
      });
      return Promise.reject({ status, message, data: error.response?.data });
    }

    // ✅ Token refresh flow on 401
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshAccessToken();

      if (success) {
        return apiClient(originalRequest);
      } else {
        Router.push("/login");
        return Promise.reject({ status: 401, message: "Unauthorized" });
      }
    }

    // ✅ Retry on network or 5xx errors (with exponential backoff)
    const isNetworkError = !error.response;
    const isServerError = status >= 500 && status < 600;

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if ((isNetworkError || isServerError) && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount += 1;
      const retryDelay = 1000 * originalRequest._retryCount;

      return new Promise((resolve) => {
        setTimeout(() => resolve(apiClient(originalRequest)), retryDelay);
      });
    }

    // ❌ Final rejection after retries
    return Promise.reject({ status, message, data: error.response?.data });
  }
);

export default apiClient;
