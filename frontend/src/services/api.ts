import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Send cookies (HttpOnly JWT) with every request
});

// Response interceptor: redirect to login if 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear any stale auth state
      localStorage.removeItem('tkd_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
