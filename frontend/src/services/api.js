import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const USERNAME = 'user';
const PASSWORD = '1234';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
  },
});

// Add a request interceptor for authentication if needed
api.interceptors.request.use(
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

export default api;