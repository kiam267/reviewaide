import React from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';
import UsersLayout from 'Layouts/user';
const UserAuthProtected = props => {
  const router = useLocation();

  if (!localStorage.getItem('user-token')) {
    return <Navigate to={{ pathname: '/' }} />;
  }

  console.log(router.pathname);

  if (router.pathname === '/user') {
    return <>{props.children}</>;
  }
  return <UsersLayout>{props.children}</UsersLayout>;
};

export default UserAuthProtected;
