import React, { useState } from 'react';
import './App.css';
import {
  UserProtectedRouter,
  authProtectedRoutes,
  publicRoutes,
} from './Routes/allRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import VerticalLayout from './Layouts/admin';
import './assets/scss/theme.scss';
import AuthProtected from './Routes/DashboardAuthProtected';
import UserAuthProtected from 'Routes/UserAuthProtected';
import UsersLayout from 'Layouts/user';
import { Profile } from 'pages/user';

function App() {
  const [isNew, setIsNew] = useState(
    Boolean(Number(localStorage.getItem('isValid')))
  );



  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx} element={route.component} />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
              </AuthProtected>
            }
          />
        ))}
        {UserProtectedRouter.map((route, idx) => (
          <React.Fragment key={idx}>
            <Route
              path={route.path}
              element={
                <UserAuthProtected>
                  <div style={{ pointerEvents: isNew ? 'painted' : 'none' }}>
                    {isNew ? (
                      <UsersLayout>{<route.component />}</UsersLayout>
                    ) : (
                      <UsersLayout>
                        {' '}
                        <Profile />
                      </UsersLayout>
                    )}
                  </div>
                </UserAuthProtected>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </React.Fragment>
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
