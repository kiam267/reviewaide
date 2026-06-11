import { REACT_APP_SERVER_API } from '../helpers/url_helper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useAdminLogin = () => {
  const adminLoginReponse = async (admin: Login) => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...admin }),
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } else {
      toast.success(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
      if (data.success) {
        localStorage.setItem('admin-token', data.token);
        window.location.href = '/super-admin/allUsers';
      }
    }
  };

  const {
    mutateAsync: adminLogin,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['admin-login'],
    mutationFn: adminLoginReponse,
  });

  return { adminLogin, isPending, error };
};
export const useCreateAdmin = () => {
  const createCurrentAdminResponse = async (admin: SignUp) => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/admin/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...admin }),
      }
    );

    const data = await response.json();
    if (!data.userInfo) {
      toast.error(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } else {
      toast.success(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  const {
    mutateAsync: userSignUp,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['admin-signup'],
    mutationFn: createCurrentAdminResponse,
  });

  return { userSignUp, isPending, error, isSuccess };
};
type UserStatus = 'active' | 'pending' | 'deactivated';
interface UserViaAdmin {
  data?: {
    id: number;
    fullName: string;
    email: string;
    phone: number;
    companyLogo: string;
    companyName: string;
    googleLink: string;
    facebookLink: string;
    userStatus: UserStatus;
    createdAt: string;
  };
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface UserViaAdminSeachState {
  page: number;
  searchUserName: string;
  searchUserStatus: string;
  searchUserEmail: string;
  searchCompanyName: string;
  searchPhoneNumber: string | number;
}

export const useGetUserViaAdmin = (
  token: string,
  searchState: UserViaAdminSeachState
) => {
  const getUserViaAdmin = async (): Promise<UserViaAdmin> => {
    const params = new URLSearchParams();

    params.set('page', searchState.page.toString());
    params.set('fullName', searchState.searchUserName.toString());
    params.set('searchUserStatus', searchState.searchUserStatus.toString());
    params.set('searchUserEmail', searchState.searchUserEmail.toString());
    params.set('searchPhoneNumber', searchState.searchPhoneNumber.toString());
    params.set('searchCompanyName', searchState.searchCompanyName.toString());

    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/admin?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return data;
  };

  const {
    data: getUserInfo,
    refetch,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['admin'],
    queryFn: () => getUserViaAdmin(),
  });

  return { getUserInfo, refetch, isPending, error, isSuccess };
};

export const useDeletUserViaAdmin = () => {
  const deleteUserViaAdminResponse = async ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/admin`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!data.success) {
      toast.error(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } else {
      toast.success(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  const {
    mutateAsync: deleteUserViaAdmin,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['delete-user-via-admin'],
    mutationFn: deleteUserViaAdminResponse,
  });

  return { deleteUserViaAdmin, isPending, error, isSuccess };
};
type UserUdateStatus = 'active' | 'pending' | 'deactivated';
interface DataType {
  id: number;
  fullName: string;
  password: string;
  email: string;
  phone: number;
  companyLogo: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
  userStatus: UserUdateStatus;
  createdAt: string;
}
export const useUpdateUserViaAdmin = () => {
  const updateUserViaAdminResponse = async ({
    user,
    token,
  }: {
    user: DataType;
    token: string;
  }) => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...user }),
    });

    const data = await response.json();
    if (!data.success) {
      toast.error(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } else {
      toast.success(data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  const {
    mutateAsync: updateUserViaAdmin,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['update-user-via-admin'],
    mutationFn: updateUserViaAdminResponse,
  });

  return { updateUserViaAdmin, isPending, error, isSuccess };
};
