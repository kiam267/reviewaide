import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-toastify';

export const useAdminLogin = () => {
  return useMutation({
    mutationKey: ['admin-login'],
    mutationFn: async (admin: Login) => {
      const data = await apiClient.post<any>(
        '/api/admin',
        admin,
      );

      return data;
    },

    onSuccess: data => {
      toast.success(data.response.message);
      localStorage.setItem(
        'authorization',
        data.response.data.token,
      );
      window.location.href = '/super-admin/allUsers';
    },

    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
};
export const useCreateAdmin = () => {
  return useMutation({
    mutationKey: ['admin-signup'],
    mutationFn: (admin: SignUp) =>
      apiClient.post<any>('/api/admin/sign-up', admin),

    onSuccess: data => {
      if (!data.userInfo) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    },

    onError: () => {
      toast.error('Signup failed');
    },
  });
};

export const useGetUserViaAdmin = (
  searchState: UserViaAdminSeachState,
) => {
  return useQuery({
    queryKey: ['admin-users', searchState], // ✅ important
    queryFn: async (): Promise<UserViaAdmin> => {
      const params = {
        page: searchState.page,
        fullName: searchState.searchUserName,
        searchUserStatus: searchState.searchUserStatus,
        searchUserEmail: searchState.searchUserEmail,
        searchPhoneNumber: searchState.searchPhoneNumber,
        searchCompanyName: searchState.searchCompanyName,
      };

      return apiClient.get('/api/admin', params);
    },
  });
};

export const useDeleteUserViaAdmin = () => {
  return useMutation({
    mutationKey: ['delete-user'],

    mutationFn: ({ email }: { email: string }) =>
      apiClient.delete('/api/admin', { email }),

    onSuccess: (data: any) => {
      toast.success(data.message);
    },

    onError: () => {
      toast.error('Delete failed');
    },
  });
};

export const useUpdateUserViaAdmin = () => {
  return useMutation({
    mutationKey: ['update-user'],

    mutationFn: (user: DataType) =>
      apiClient.put('/api/admin', user),

    onSuccess: (data: any) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Update failed');
    },
  });
};
