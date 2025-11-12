// lib/apiClient.ts
import axios from 'axios';

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    timezone: userTimeZone,
  },
});

export const refreshAccessToken = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true;
  } catch (error) {
    return false;
  }
};

// ✅ Normalize all errors
function normalizeError(error: any) {
  const status = error.response?.status;
  const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Unexpected error occurred';
  return { message, status };
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh-token');

    console.warn('⛔ Interceptor caught error:', {
      status,
      url: originalRequest?.url,
      _retry: originalRequest?._retry,
    });

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      const success = await refreshAccessToken();
      if (success) {
        return apiClient(originalRequest);
      }
      return Promise.reject({ ...normalizeError(error), isAuthError: true });
    }

    console.error('🚫 Request failed:', {
      url: originalRequest?.url,
      error: error?.response?.data || error.message,
    });

    return Promise.reject(normalizeError(error));
  }
);

export default apiClient;
