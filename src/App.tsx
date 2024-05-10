import React, { useState, lazy, Suspense } from 'react';
import './App.css';

import {
  UserProtectedRouter,
  AdminAuthProtectedRouter,
  publicRoutes,
} from './Routes/allRoutes';
import { Route, Routes } from 'react-router-dom';
import './assets/scss/theme.scss';
import UserAuthProtected from 'Routes/UserAuthProtected';
import { ToastContainer } from 'react-toastify';
import AdminAuthProtected from 'Routes/AdminAuthProtected';

function App() {
  return (
    <div>
      <Suspense fallback={<p>lodding...</p>}>
        <ToastContainer />
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} key={idx} element={route.component} />
          ))}

          {AdminAuthProtectedRouter.map((route, idx) => (
            <React.Fragment key={idx}>
              <Route
                path={route.path}
                element={
                  <AdminAuthProtected>{route.component}</AdminAuthProtected>
                }
              />
            </React.Fragment>
          ))}
          {UserProtectedRouter.map((route, idx) => (
            <React.Fragment key={idx}>
              <Route
                path={route.path}
                element={
                  <UserAuthProtected>{<route.component />}</UserAuthProtected>
                }
              />
            </React.Fragment>
          ))}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
