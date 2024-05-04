import { getUser } from 'api/createUsers';
import React from 'react';
import {
  Navigate,
  useNavigate,
  useRoutes,
  useLocation,
} from 'react-router-dom';
import UsersLayout from 'Layouts/user';
import Profile from 'pages/user/Profile';
const UserAuthProtected = props => {
  const router = useLocation();

  if (!localStorage.getItem('user-token')) {
    return <Navigate to={{ pathname: '/' }} />;
  }

  if (router.pathname.includes('user')) {
    return <>{props.children}</>;
  }
  return <UsersLayout>{props.children}</UsersLayout>;
};

export default UserAuthProtected;
