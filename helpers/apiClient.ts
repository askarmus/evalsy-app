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

    const isPublicRequest = originalRequest?.meta?.public === true;

    if (status === 401 && !isPublicRequest && !originalRequest._retry && originalRequest.url !== "/auth/refresh-token") {
      originalRequest._retry = true;
      const success = await refreshAccessToken();
      if (success) return apiClient(originalRequest);

      // Don't redirect in API client - throw an error instead
      return Promise.reject({ isAuthError: true });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
