import axios from 'axios';

// Create an Axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Request Interceptor: Automatically attach the JWT token if it exists in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Optional error handling placeholder
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server returns 401 Unauthorized, we can clear local token or redirect
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
