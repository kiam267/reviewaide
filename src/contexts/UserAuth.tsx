import { createContext, useContext, useState, useMemo } from 'react';
export const AuthContext = createContext<any | null>(null);

interface Auth {
  isLoggedIn: boolean;
  storeToken: (serverToken: any) => void;
  LogoutUser: () => void;
  token: string | null;
}

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('UserToken')
  );
  let isLoggedIn = !!token;

  const storeToken = (serverToken: string) => {
    setToken(serverToken);
    return localStorage.setItem('UserToken', serverToken);
  };

  const LogoutUser = () => {
    setToken('');
    return localStorage.removeItem('UserToken');
  };

  const obj: Auth = useMemo(
    () => ({ isLoggedIn, storeToken, LogoutUser, token }),
    [isLoggedIn]
  );
  return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>;
};

export const useUserAuth = () => {
  const authContextValue: Auth = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth used outside of the Provider');
  }

  return authContextValue;
};
