import { getUser } from 'api/createUsers';
import { Profile } from 'pages/user';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const UserAuthProtected = props => {
  if (!localStorage.getItem('UserToken')) {
    return <Navigate to={{ pathname: '/login' }} />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default UserAuthProtected;
