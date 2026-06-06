import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const tokenStorageKey = 'task-manager-token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return !decoded.exp || Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem(tokenStorageKey);
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(tokenStorageKey);

    if (token) {
      if (isTokenExpired(token)) {
        clearStoredAuth();
        redirectToLogin();
        return config;
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredAuth();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export { tokenStorageKey, clearStoredAuth, isTokenExpired };
export default api;