import axios from 'axios';
import { handleLocalRequest } from './localBackend';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle server responses & seamless fallback to local engine
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config;

    // Handle 401 Unauthorized from real server
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Network Error or 404/ERR_CONNECTION_REFUSED on static host -> Fallback to in-browser engine
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404) {
      try {
        const payload = config.data ? JSON.parse(config.data) : null;
        const localResponse = await handleLocalRequest(config.url, config.method, payload);
        return localResponse;
      } catch (localErr) {
        return Promise.reject(new Error(localErr.message || 'Operation failed'));
      }
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
