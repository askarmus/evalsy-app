import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Router from "next/router";

// Create the Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Helper function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken"); // Get the refresh token from cookies

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Make a request to refresh the access token
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const newAccessToken = response.data.token;
    Cookies.set("userAuth", newAccessToken); // Update the access token in cookies

    return newAccessToken;
  } catch (error) {
    // Handle errors in refreshing token
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Add a request interceptor to include the bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("userAuth");
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    config.headers.timeZone = userTimeZone;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and refresh token logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "An unexpected error occurred.";

    // Handle 401 Unauthorized error (token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite loop

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } else {
        // If refresh fails, log out the user
        Cookies.remove("userAuth");
        Cookies.remove("refreshToken");
        toast.error("Session expired. Please log in again.");
        Router.push("/login");
      }
    } else {
      // For other errors, show toast notification
      toast.error(message);
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default apiClient;
