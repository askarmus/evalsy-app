import axios from "axios";
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
    // Retrieve the token from storage or context

    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Nzk2ZDg5ODY5OTZmNDk5YjQ3NDE0MCIsImVtYWlsIjoiYXNrYXJtdXNAaG90bWFpbC5jb21tbSIsImlhdCI6MTczNjAxMjE2OCwiZXhwIjoxNzM2MDk4NTY4fQ.q3eluqImerqjrNLs-myuS__q1q1A9zXTQ_ryRu78K1s`;

    return config;
  },
  (error) => {
    // Handle request errors
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
