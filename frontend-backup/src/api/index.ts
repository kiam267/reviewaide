import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

// 🔥 Base URL
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 🔥 Create instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Developer: 'kiam',
  },
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.error('Bad Request');
          break;
        case 401:
          console.error('Unauthorized');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 500:
          console.error('Server Error');
          break;
        default:
          console.error('Unexpected error');
      }

      return Promise.reject(error.response.data);
    }

    if (error.request) {
      console.error('Network error');
    }

    return Promise.reject(error);
  },
);

export default api;
