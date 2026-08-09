import api from '@/api';
import { AxiosRequestConfig } from 'axios';

export const apiClient = {
  get: <T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ) =>
    api
      .get<T>(url, { params, ...config })
      .then(res => res.data),

  post: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ) => api.post<T>(url, data, config).then(res => res.data),

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => api.put<T>(url, data, config).then(res => res.data),

  delete: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) =>
    api
      .delete<T>(url, {
        data,
        ...config,
      })
      .then(res => res.data),
};
