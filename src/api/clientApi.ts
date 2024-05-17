import { REACT_APP_SERVER_API } from '../helpers/url_helper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';

interface ClientResponse {
  data?: {
    createdAt: Date;
    private: string;
    clientName: string;
    uniqueId: number;
    rating: number;
    method: 'facebook' | 'google' | 'private';
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
export const useGetClient = (
  sesstion: string | null,
  searchState: ClientSearchState
) => {
  const getClient = async (): Promise<ClientResponse> => {
    const params = new URLSearchParams();

    params.set('page', searchState.page.toString());
    params.set('clientName', searchState.clientName.toString());
    params.set('method', searchState.method.toString());
    params.set('rating', String(searchState.rating));

    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/client?${params}`,
      {
        method: 'GET',
        headers: {
          token: `Bearer ${sesstion}`,
        },
      }
    );

    const data = await response.json();
    return data;
  };

  const {
    data: getClientInfo,
    refetch,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['client'],
    queryFn: () => getClient(),
  });

  return { getClientInfo, refetch, isPending, error, isSuccess };
};

type Method = 'facebook' | 'google';
interface CreateClient {
  id: string | undefined;
  method?: Method;
  clientName?: string;
  clientMessage?: string;
  rating?: number;
}

export const useCreateClient = () => {
  const createCurrentClient = async (client: CreateClient) => {
    const response = await fetch(`${REACT_APP_SERVER_API}/api/my/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...client }),
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
    mutateAsync: createClient,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['client-create'],
    mutationFn: createCurrentClient,
  });

  return { createClient, isPending, error, isSuccess };
};

export interface QRCodeGen {
  companyLogo: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
}

export const useCretaeQrCodeLink = () => {
  const createCurrentQRCode = async ({
    token,
    user,
  }: {
    token: string;
    user: QRCodeGen;
  }) => {
    if (!user.companyLogo) {
      return toast.error('please add a company Logo', {
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

    const formData = new FormData();

    formData.append('companyName', user?.companyName);

    if (user?.googleLink) {
      formData.append('googleLink', user?.googleLink);
    }
    if (user?.facebookLink) {
      formData.append('facebookLink', user?.facebookLink);
    }
    formData.append('companyLogo', user?.companyLogo);

    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/client/link-generator`,
      {
        method: 'POST',
        headers: {
          token: `Bearer ${token}`,
        },
        body: formData,
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
    mutateAsync: createQRCode,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['qrcode'],
    mutationFn: createCurrentQRCode,
  });

  return { createQRCode, isPending, error, isSuccess };
};
interface ClientLinkResponse {
  data?: [{ uniqueId: string; companyName: string }];
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
}
export const useGetClientLink = (token: string) => {
  const getClientLink = async (): Promise<ClientLinkResponse> => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/client/link-generator`,
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
    data: getClientLinkInfo,
    refetch,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['client-link'],
    queryFn: () => getClientLink(),
  });

  return { getClientLinkInfo, refetch, isPending, error, isSuccess };
};

export const useDeleteClientLink = () => {
  const deleteClient = async ({
    uniqueId,
    token,
  }: {
    uniqueId: string;
    token: string;
  }) => {
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/client/link-generator`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({ uniqueId }),
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
    mutateAsync: createClient,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['delete-create'],
    mutationFn: deleteClient,
  });

  return { createClient, isPending, error, isSuccess };
};

interface ClientLogoResponse {
  data?: {
    companyLogo: string;
    facebookLink: string;
    googleLink: string;
  };
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
}
export const useReviewLogo = ({ uniqueId }: { uniqueId: string }) => {
  const getReviewLogo = async (): Promise<ClientLogoResponse> => {
    const params = new URLSearchParams();
    params.set('uniqueId', uniqueId);
    const response = await fetch(
      `${REACT_APP_SERVER_API}/api/my/client/link-logo-query?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data;
  };

  const {
    data: getReviewLogoInfo,
    isSuccess,
    isPending,
    error,
  } = useQuery({
    queryKey: ['client-logo'],
    queryFn: () => getReviewLogo(),
  });

  return { getReviewLogoInfo, isPending, error, isSuccess };
};
