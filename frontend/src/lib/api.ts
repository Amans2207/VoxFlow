import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  timeout: 30000,
});

// 🛡️ VOXFLOW ZERO-FAILURE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is down or returns error
    if (!error.response) {
      toast.error("Neural Engine Maintenance: Reconnecting to Titan-X Core...", {
        icon: '🛰️',
        style: {
          borderRadius: '20px',
          background: '#0A0A0B',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '10px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }
      });
    } else if (error.response.status === 402) {
      toast.error("Neural Fuel Low: Recharge Credits.");
    } else if (error.response.status === 401) {
      toast.error("Session Expired: Re-syncing Identity.");
    } else {
      toast.error(`System Glitch: ${error.response.data?.error || 'Neural Bridge unstable.'}`);
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url: string) => axiosInstance.get(url),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  upload: (url: string, formData: FormData) => axiosInstance.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
