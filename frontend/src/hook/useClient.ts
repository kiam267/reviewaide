import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-toastify';

export const useGetClient = (
  searchState: ClientSearchState,
) => {
  return useQuery({
    queryKey: ['clients', searchState],

    queryFn: (): Promise<ClientResponse> => {
      return apiClient.get('/api/client', {
        page: searchState.page,
        clientName: searchState.clientName,
        method: searchState.method,
        rating: searchState.rating,
      });
    },
  });
};

export const useCreateClient = () => {
  return useMutation({
    mutationKey: ['client-create'],

    mutationFn: (client: CreateClient) =>
      apiClient.post('/api/client', client),

    onSuccess: (data: any) => {
      data.success
        ? toast.success(data.message)
        : toast.error(data.message);
    },

    onError: () => toast.error('Create failed'),
  });
};

export const useCreateQrCodeLink = () => {
  return useMutation({
    mutationKey: ['qrcode'],

    mutationFn: async (orgDeatils: QRCodeGen) => {
      const formData = new FormData();

      formData.append(
        'companyName',
        orgDeatils.companyName,
      );
      formData.append('googleLink', orgDeatils.googleLink);
      formData.append(
        'facebookLink',
        orgDeatils.facebookLink,
      );

      // IMPORTANT: append actual file object
      formData.append(
        'companyLogo',
        orgDeatils.companyLogo,
      );

      return apiClient.post(
        '/api/client/qr_gen',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    },

    onSuccess: (data: any) => {
      data.success
        ? toast.success(data.message)
        : toast.error(data.message);
    },

    onError: (err: any) => {
      toast.error(err.message || 'QR generation failed');
    },
  });
};

export const useGetClientLink = () => {
  return useQuery({
    queryKey: ['client-links'],

    queryFn: (): Promise<ClientLinkResponse> =>
      apiClient.get('/api/client/qr_gen'),

    // ✅ ADD THESE
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    // optional (very useful)
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useDeleteClientLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-client-link'],

    mutationFn: (deleteId: string) =>
      apiClient.delete('/api/client/qr_gen', {
        deleteId,
      }),

    onSuccess: (data: any) => {
      data.success
        ? toast.success(data.message)
        : toast.error(data.message);

      queryClient.invalidateQueries({
        queryKey: ['client-links'],
      });
    },

    onError: () => toast.error('Delete failed'),
  });
};

export const useReviewLogo = (uniqueId: string) => {
  return useQuery({
    queryKey: ['client-logo', uniqueId],

    queryFn: (): Promise<ClientLogoResponse> =>
      apiClient.get('/api/client/link-logo-query', {
        uniqueId,
      }),

    enabled: !!uniqueId,
  });
};
