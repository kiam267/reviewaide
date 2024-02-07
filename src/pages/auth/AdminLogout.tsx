import React, { useEffect } from 'react';
import withRouter from 'Components/Common/withRouter';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'contexts/auth';

const Logout = () => {
  const { isLoggedIn, LogoutUser } = useAuth();
  useEffect(() => {
    LogoutUser();
  }, [isLoggedIn]);

  return <Navigate to="/auth/login" />;
};

export default withRouter(Logout);
