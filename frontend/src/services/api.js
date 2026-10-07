import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerlens_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // 401 Unauthorized
      if (error.response.status === 401) {
        // Clear expired session if not on login pages
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && window.location.pathname !== '/') {
          localStorage.removeItem('careerlens_token');
          localStorage.removeItem('careerlens_user');
          window.location.href = '/student/login';
        }
      }
      return Promise.reject(error.response.data || { message: error.message });
    }

    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return Promise.reject({ message: 'Request timed out. The operation may still be processing in the background.' });
    }

    return Promise.reject({ message: error.message || 'Network error or server unavailable. Please try again.' });
  }
);

export default api;
