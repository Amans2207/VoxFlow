/**
 * TITAN-X GLOBAL CONFIGURATION
 * Centralized endpoint for all Neural Link operations.
 */
export const API_BASE_URL = 'http://localhost:5001';

export const endpoints = {
  health: `${API_BASE_URL}/api/health`,
  auth: `${API_BASE_URL}/api/auth`,
  video: `${API_BASE_URL}/api/ai/process-video`,
  credits: `${API_BASE_URL}/api/user/credits`,
};

export default API_BASE_URL;
