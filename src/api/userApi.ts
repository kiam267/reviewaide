import { REACT_APP_SERVER_API } from '../helpers/url_helper';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useMatchMyUser = () => {
  const matchUserLogin = async (user: UserLogin) => {
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
    return data;
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
