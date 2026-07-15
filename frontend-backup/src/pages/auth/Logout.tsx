import React, { useEffect } from 'react';
import withRouter from 'Components/Common/withRouter';
import { Navigate } from 'react-router-dom';

import { useUserAuth } from '../../contexts/UserAuth';

const Logout = () => {
  const { isLoggedIn, LogoutUser } = useUserAuth();
  useEffect(() => {
    LogoutUser();
  }, [isLoggedIn]);

  return <Navigate to="/" />;
};

export default withRouter(Logout);
