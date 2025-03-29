import { addToast } from "@heroui/react";
import axios from "axios";
import Router from "next/router";

// Create the Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ Important for cookie-based auth
});

// ✅ Helper to refresh access token
export const refreshAccessToken = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true; // Token refresh succeeded
  } catch (error: any) {
    // ✅ Gracefully handle expected 401/403 errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("Refresh token expired or invalid.");
        return false; // This will trigger logout
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

// ✅ Add timezone to every request
apiClient.interceptors.request.use(
  (config) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers["timezone"] = userTimeZone;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle responses globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || "An unexpected error occurred.";

    // ✅ Special case for login failure
    if (originalRequest.url?.includes("/auth/login") && status === 401) {
      addToast({
        description: "Invalid email or password. Please try again.",
        color: "danger",
      });
      return Promise.reject({ status, message, data: error.response?.data });
    }

    // ✅ Refresh token on 401 error
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshAccessToken();

      if (success) {
        return apiClient(originalRequest);
      }
    }

    // Optional: handle other error globally
    // addToast({ description: message, color: "danger" });

    return Promise.reject({ status, message, data: error.response?.data });
  }
);

export default apiClient;
