import api from '@/api';

export const apiClient = {
  get: <T>(url: string, params?: any) =>
    api.get<T>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: any) =>
    api.post<T>(url, data).then(res => res.data),

  put: <T>(url: string, data?: any) =>
    api.put<T>(url, data).then(res => res.data),

  delete: <T>(url: string, data: any) =>
    api
      .delete<T>(url, {
        data,
      })
      .then(res => res.data),
};
