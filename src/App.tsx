import React from 'react';
import './App.css';
import {
  UserProtectedRouter,
  authProtectedRoutes,
  publicRoutes,
} from './Routes/allRoutes';
import { Route, Routes } from 'react-router-dom';
import VerticalLayout from './Layouts/VerticalLayout';
import './assets/scss/theme.scss';
import NonAuthLayout from './Layouts/NonLayout';
import AuthProtected from './Routes/DashboardAuthProtected';
import UserAuthProtected from 'Routes/UserAuthProtected';
import UsersLayout from 'Layouts/UsersLayout';

function App() {
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <React.Fragment>
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              </React.Fragment>
            }
          />
        ))}
        {UserProtectedRouter.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <React.Fragment>
                <UserAuthProtected>
                  <UsersLayout>{route.component}</UsersLayout>
                </UserAuthProtected>
              </React.Fragment>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
