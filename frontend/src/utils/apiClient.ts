import axios from 'axios';
import { toast } from 'react-hot-toast';

import { createClient } from './supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const supabase = createClient();

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s for autonomous tasks
});

// Request Interceptor for Auth/Headers
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
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
  const data = error.response?.data;
  const message = data?.detail || data?.message || data?.error || "Neural Core Connection Failed";

  if (status === 422) {
    toast.error(`Validation Error: ${message}`, { id: 'api-error' });
  } else if (status === 500) {
    toast.error("Critical Engine Failure. Retrying...", { id: 'api-error' });
  } else if (status === 402) {
    toast.error("Insufficient Credits. Please Top-Up.", { icon: '💰', id: 'api-error' });
    if (typeof window !== 'undefined') {
       window.dispatchEvent(new CustomEvent('open-credits-modal'));
    }
  } else if (status === 401) {
    toast.error("Session Expired. Please Re-authenticate.");
  } else {
    toast.error(message, { id: 'api-error' });
  }

  return Promise.reject(error);
});

export default apiClient;
