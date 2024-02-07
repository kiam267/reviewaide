import { createContext, useContext, useState, useMemo, useEffect } from 'react';
export const AuthContext = createContext<any | null>(null);

interface Auth {
  isLoggedIn: boolean;
  storeToken: (serverToken: any) => void;
  LogoutUser: () => void;
  token: string | null;
  avater: (avater: any, username: string) => void;
  isNewUser: (token: boolean | number) => void;
  IsValidUSER: boolean;
}

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('UserToken')
  );
  const [isValidUser, setIsValidUser] = useState<boolean | null>(
    localStorage.getItem('isValid') === 'false'   ? false : true,
  );
  let IsValidUSER = !!isValidUser;
  let isLoggedIn = !!token;
  console.log(IsValidUSER, isValidUser);

  let avater = (avater: string, username) => {
    localStorage.setItem('avater', avater);
    localStorage.setItem('name', username);
    return;
  };
  const storeToken = (serverToken: string) => {
    setToken(serverToken);
    return localStorage.setItem('UserToken', serverToken);
  };

  const LogoutUser = () => {
    setToken('');
    localStorage.removeItem('avater');
    localStorage.removeItem('name');
    localStorage.removeItem('isValid');
    return localStorage.removeItem('UserToken');
  };

  const isNewUser = isValid => {
    return localStorage.setItem('isValid', isValid);
  };

  const obj: Auth = useMemo(
    () => ({
      isLoggedIn,
      storeToken,
      LogoutUser,
      token,
      avater,
      isNewUser,
      IsValidUSER,
    }),
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
