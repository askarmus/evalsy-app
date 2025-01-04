// apiClient.ts
import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

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
