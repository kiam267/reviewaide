import React, { useState } from 'react';
import './App.css';
import {
  UserProtectedRouter,
  authProtectedRoutes,
  publicRoutes,
  publiceRecoardwithprivateReview,
} from './Routes/allRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import VerticalLayout from './Layouts/admin';
import PubliceLayout from './Layouts/public';
import './assets/scss/theme.scss';
import AuthProtected from './Routes/DashboardAuthProtected';
import UserAuthProtected from 'Routes/UserAuthProtected';
import CsvToJsonConverter from 'Layouts/user/Test';

function App() {
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx} element={route.component} />
        ))}

        {publiceRecoardwithprivateReview.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={<PubliceLayout>{route.component}</PubliceLayout>}
          />
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
                <UserAuthProtected>{<route.component />}</UserAuthProtected>
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
