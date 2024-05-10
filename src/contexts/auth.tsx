import { createContext, useContext, useState, useMemo } from 'react';
export const AuthContext = createContext<any | null>(null);

interface Auth {
  isLoggedIn: boolean;
  storeToken: (serverToken:  any, isAdmin: boolean) => void;
  LogoutUser: () => void;
  token: string | null;
  isAdmin: boolean;
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('admin-token')
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  let isLoggedIn = !!token;


  const storeToken = (serverToken : string, isAdmin : boolean) => {
    setToken(serverToken);
    setIsAdmin(isAdmin);
    return localStorage.setItem('admin-token', serverToken);
  };

  const LogoutUser = () => {
    setToken('');
    setIsAdmin(false);
    return localStorage.removeItem('admin-token');
  };

  const obj: Auth = useMemo(
    () => ({ isLoggedIn, storeToken, LogoutUser, token, isAdmin }),
    [isLoggedIn]
  );
  return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContextValue : Auth = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth used outside of the Provider');
  }

  return authContextValue;
};
