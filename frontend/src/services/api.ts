import axios from 'axios';

// Note: Ensure the backend is running on 8080. If deploying with Nginx, use /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add interceptors here for auth tokens, etc.

export default api;
