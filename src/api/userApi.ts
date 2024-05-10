import { REACT_APP_SERVER_API } from '../helpers/url_helper';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { date } from 'yup';

export const useMatchMyUser = () => {
  const matchUserLogin = async (user: Login) => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }
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
      if (data.redirect) {
        localStorage.setItem('user-token', data.token);
        window.location.href = '/user';
      }
    }
  };

  const {
    mutateAsync: userLogin,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['matchUserLogin'],
    mutationFn: matchUserLogin,
  });

  return { userLogin, isPending, error };
};
export const useCreateUser = () => {
  const createCurrentUser = async (user: SignUp) => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/user/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user }),
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
    mutationKey: ['matchUserLogin'],
    mutationFn: createCurrentUser,
  });

  return { userSignUp, isPending, error, isSuccess };
};

export const useForgetPassword = () => {
  const forgetPassword = async (email: { email: string; link: string }) => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/user/user-forget-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...email }),
      }
    );

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
    mutateAsync: userForgetPassword,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['forgetPassword'],
    mutationFn: forgetPassword,
  });

  return { userForgetPassword, isPending, error, isSuccess };
};

type ResetPassword = {
  id: string | number | undefined;
  token: string | undefined;
  password: string;
};
export const useResetPassword = () => {
  const resetPassword = async ({ id, token, password }: ResetPassword) => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/user/user-reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          id: `${id}`,
          token: `${token}`,
        },
        body: JSON.stringify({ password }),
      }
    );

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
      // useNavigate
    }
  };

  const {
    mutateAsync: userResetPassword,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
  });

  return { userResetPassword, isPending, error, isSuccess };
};

type User = {
  tokenInvalid?: boolean;
  message?: string;
  success: boolean;
  readonly redirect?: boolean;
  readonly verify: boolean;
};

export const useGetUser = (token: string) => {
  const getUser = async (): Promise<User> => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  };

  const {
    data: getUerInfo,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
  });

  return { getUerInfo, isPending, error, isSuccess };
};

type UserInfo = {
  token: string | null | undefined;
  formData?: object | null | any;
  values: UserMoreDetailInfo;
};

export const usePutUserInfo = () => {
  const userInfo = async ({ token, values }: UserInfo) => {
    console.log(token, values);
    
    const formData = new FormData();
    formData.append('companyName', values.companyName);
    formData.append('googleLink', values?.googleLink);
    formData.append('facebookLink', values?.facebookLink);
    formData.append('companyLogo', values?.companyLogo);
    if (values.fullName && values.phone) {
      formData.append('fullName', values.fullName);
      formData.append('phone', values.phone);
    }
    console.log(formData);

    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/user/user-moredata`,
      {
        method: 'PUT',
        headers: {
          token: `Bearer ${token}`,
        },
        body: formData, // Use formData directly
      }
    );

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
    if (data.tokenInvalid) {
      window.location.href = '/logout';
    }
  };

  const {
    mutateAsync: userMoreInfo,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['UserInfo'],
    mutationFn: userInfo,
  });

  return { userMoreInfo, isPending, error, isSuccess };
};

// Header Content
interface Header {
  success: boolean;
  message: string;
  tokenInvalid?: boolean | null;
  data: {
    companyName?: string;
    companyLogo?: string;
  } | null;
}

export const useGetHeader = (token: string | null) => {
  const getHeader = async (): Promise<Header> => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/user/header`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  };

  const {
    data: getHeaderInfo,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['header'],
    queryFn: () => getHeader(),
  });

  return { getHeaderInfo, isPending, error, isSuccess };
};

interface Profile {
  success: boolean;
  message: string;
  tokenInvalid?: boolean | null;
  data: {
    id: number;
    fullName: string;
    password: string;
    email: string;
    phone: string;
    companyLogo: string;
    companyName: string;
    googleLink: string;
    facebookLink: string;
    userEmailText?: string;
    userSmsText?: string;
  } | null;
}
export const useGetProfile = (token: string | null) => {
  const getProfile = async (): Promise<Profile> => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/user/profile`,
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
    data: getProfileInfo,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });

  return { getProfileInfo, isPending, error, isSuccess };
};
