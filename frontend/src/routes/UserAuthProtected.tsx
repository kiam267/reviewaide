import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UsersLayout from '@/layouts/user';
const UserAuthProtected = props => {
  const router = useLocation();

  if (!localStorage.getItem('token')) {
    return <Navigate to={{ pathname: '/' }} />;
  }



  if (router.pathname === '/user') {
    return <>{props.children}</>;
  }
  return <UsersLayout>{props.children}</UsersLayout>;
};

export default UserAuthProtected;
