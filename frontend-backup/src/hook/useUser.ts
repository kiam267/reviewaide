import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-toastify';

export const useMatchMyUser = () => {
  return useMutation({
    mutationKey: ['user-login'],

    mutationFn: (user: Login) =>
      apiClient.post<any>('/api/users', user),

    onSuccess: data => {
      if (!data?.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      if (data.token) {
        localStorage.setItem('user-token', data.token);
        window.location.href = '/user';
      }
    },

    onError: (err: any) => {
      toast.error(err.message || 'Login failed');
    },
  });
};
export const useCreateUser = () => {
  return useMutation({
    mutationKey: ['user-signup'],

    mutationFn: (user: SignUp) =>
      apiClient.post('/api/users/sign-up', user),

    onSuccess: (data: any) => {
      if (!data.userInfo) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    },

    onError: () => toast.error('Signup failed'),
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationKey: ['forget-password'],

    mutationFn: (payload: {
      email: string;
      link: string;
    }) =>
      apiClient.post(
        '/api/users/user-forget-password',
        payload,
      ),

    onSuccess: (data: any) => {
      data.success
        ? toast.success(data.message)
        : toast.error(data.message);
    },

    onError: () => toast.error('Something went wrong'),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['reset-password'],

    mutationFn: ({ id, token, password }: ResetPassword) =>
      apiClient.post('/api/users/user-reset-password', {
        id,
        token,
        password,
      }),

    onSuccess: (data: any) => {
      data.success
        ? toast.success(data.message)
        : toast.error(data.message);
    },

    onError: () => toast.error('Reset failed'),
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],

    queryFn: () => apiClient.get<User>('/api/users'),
  });
};

export const usePutUserInfo = () => {
  return useMutation({
    mutationKey: ['user-info'],

    mutationFn: async ({ values }: UserInfo) => {
      const formData = new FormData();

      formData.append('companyName', values.companyName);
      formData.append('googleLink', values.googleLink);
      formData.append('facebookLink', values.facebookLink);
      formData.append('companyLogo', values.companyLogo);

      if (values.fullName && values.phone) {
        formData.append('fullName', values.fullName);
        formData.append('phone', values.phone);
      }

      return apiClient.put(
        '/api/users/user-moredata',
        formData,
      );
    },

    onSuccess: (data: any) => {
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }

      if (data.tokenInvalid) {
        window.location.href = '/logout';
      }
    },

    onError: () => toast.error('Update failed'),
  });
};

export const useGetHeader = () => {
  return useQuery({
    queryKey: ['header'],
    queryFn: () =>
      apiClient.get<Header>('/api/users/header'),
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      apiClient.get<Profile>('/api/users/profile'),
  });
};
