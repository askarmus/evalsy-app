import { addToast } from "@heroui/react";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ Needed to clear cookies on logout
import Router from "next/router";

// Create the Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ Ensures authentication cookies are sent
});

// ✅ Helper function to refresh the access token
const refreshAccessToken = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true; // ✅ Indicates successful refresh
  } catch (error) {
    console.error("Failed to refresh token:", error);

    // ✅ Clear cookies on refresh token failure
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    return false; // ❌ Refresh failed
  }
};

// ✅ Add a request interceptor to include headers dynamically
apiClient.interceptors.request.use(
  (config) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers["timezone"] = userTimeZone; // ✅ Attach timezone to every request
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add a response interceptor to handle errors & refresh token logic
apiClient.interceptors.response.use(
  (response) => response, // ✅ Return response if successful
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || "An unexpected error occurred.";

    // ✅ Handle login errors separately
    if (originalRequest.url?.includes("/auth/login") && status === 401) {
      addToast({
        description: "Invalid email or password. Please try again.",
        color: "danger",
      });
      return Promise.reject({ status, message, data: error.response?.data });
    }

    // ✅ Handle expired session (401 Unauthorized)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      const success = await refreshAccessToken();
      if (success) {
        return apiClient(originalRequest); // ✅ Retry the failed request
      } else {
        // ❌ Logout if refresh fails
        addToast({
          description: "Session expired. Please log in again.",
          color: "danger",
        });

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        Router.push("/login");
      }
    } else {
      addToast({
        description: message,
        color: "danger",
      });
    }

    return Promise.reject({ status, message, data: error.response?.data });
  }
);

export default apiClient;
