import axios from "axios";
import Cookies from "js-cookie"; // Use js-cookie for easier cookie handling
import { toast } from "react-toastify";

// Create the Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to include the bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("userAuth"); // Get the token from cookies
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

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred.";
    const status = error.response?.status || 500;

    toast.error(`${message}`);

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default apiClient;
