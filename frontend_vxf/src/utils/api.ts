import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000',
  withCredentials: true, // Required for HttpOnly cookies
});

// Response Interceptor for 401 Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        await axios.post('http://127.0.0.1:8000/api/auth/refresh', {}, { withCredentials: true });
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
