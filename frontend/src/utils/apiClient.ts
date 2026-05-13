import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = "http://localhost:5001";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for heavy neural tasks
});

// Request Interceptor for Auth/Headers
apiClient.interceptors.request.use((config) => {
  // Add any dynamic headers here
  console.log(`[Neural Core] Outgoing Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor for Robust Error Handling
apiClient.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.response?.data?.error || "Neural Core Connection Failed";

  if (status === 422) {
    toast.error(`Validation Error: ${message}`, { id: 'api-error' });
  } else if (status === 500) {
    toast.error("Critical Engine Failure. Retrying...", { id: 'api-error' });
  } else if (status === 401) {
    toast.error("Session Expired. Please Re-authenticate.");
  } else {
    toast.error(message, { id: 'api-error' });
  }

  return Promise.reject(error);
});

export default apiClient;
