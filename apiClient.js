// apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://interview-api-lemon.vercel.app", // Replace with your API base URL
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Default headers
    Authorization: "Bearer YOUR_TOKEN", // Example token header
  },
});

// Add a request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    // Modify the request configuration before sending it
    console.log("Request Interceptor:", config);
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
apiClient.interceptors.response.use(
  (response) => {
    // Handle the response data
    console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    // Handle response errors
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
