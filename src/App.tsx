import React from 'react';
import './App.css';
import {
  UserProtectedRouter,
  authProtectedRoutes,
  publicRoutes,
} from './Routes/allRoutes';
import { Route, Routes } from 'react-router-dom';
import VerticalLayout from './Layouts/DashboardLayout';
import './assets/scss/theme.scss';
import NonAuthLayout from './Layouts/NonLayout';
import AuthProtected from './Routes/DashboardAuthProtected';
import UserAuthProtected from 'Routes/UserAuthProtected';
import UsersLayout from 'Layouts/UsersLayout';
import Test from 'Test';

function App() {
  return (
    <React.Fragment>
      {/* <Test/> */}
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
