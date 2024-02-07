import { getUser } from 'api/createUsers';
import React from 'react';
import { Navigate } from 'react-router-dom';
import UsersLayout from 'Layouts/user';
import Profile from 'pages/user/Profile';
const UserAuthProtected = props => {
  if (!localStorage.getItem('UserToken')) {
    return <Navigate to={{ pathname: '/login' }} />;
  }
  if (!Boolean(Number(localStorage.getItem('isValid')))) {
    return (
      <div style={{ pointerEvents: 'none' }}>
        <UsersLayout>
          <Profile />
        </UsersLayout>
      </div>
    );
  }

  return <UsersLayout>{props.children}</UsersLayout>;
};

export default UserAuthProtected;
