import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 401:
          console.error('Authentication required. Please log in.');
          // Optionally redirect to login page
          break;
        case 403:
          console.error('Access forbidden. Admin privileges required.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(`Error ${status}: ${message}`);
      }
      
      error.message = `${status}: ${message}`;
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;