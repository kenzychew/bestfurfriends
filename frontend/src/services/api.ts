import axios from 'axios';
import { store } from '../store';
import { selectToken } from '../store/slices/authSlice';

// API base URL - env var in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = selectToken(state);
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle unauthorized 401 errors
    if (response && response.status === 401) {
      // Dispatch logout if token is invalid or expired
      store.dispatch({ type: 'auth/logout' });
    }
    
    return Promise.reject(error);
  }
);

export default api; 
