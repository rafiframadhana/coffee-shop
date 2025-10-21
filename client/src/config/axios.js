import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Auto-extract data from standardized backend response { success, message, data }
    return response.data;
  },
  (error) => {
    // Centralized error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - could trigger logout
        console.warn('Unauthorized access - session may have expired');
      } else if (status === 429) {
        // Rate limited
        console.warn('Rate limit exceeded - please slow down');
      } else if (status === 500) {
        console.error('Server error:', data?.message || 'Internal server error');
      }

      // Return error with useful message
      return Promise.reject({
        message: data?.message || error.message,
        status,
        data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response received');
      return Promise.reject({
        message: 'Network error - please check your connection',
        isNetworkError: true,
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: error.message,
      });
    }
  }
);

export default api;
