import React, { Suspense } from 'react';
import './global.css';
import './assets/scss/theme.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import {
  AdminAuthProtectedRouter,
  publicRoutes,
  UserProtectedRouter,
} from '@/routes/allRoutes';
import AdminAuthProtected from '@/routes/AdminAuthProtected';
import UserAuthProtected from '@/routes/UserAuthProtected';

function App() {
  return (
    <Suspense fallback={<p>lodding...</p>}>
      <ToastContainer />
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={route.component}
          />
        ))}

        {AdminAuthProtectedRouter.map((route, idx) => (
          <React.Fragment key={idx}>
            <Route
              path={route.path}
              element={
                <AdminAuthProtected>
                  {route.component}
                </AdminAuthProtected>
              }
            />
          </React.Fragment>
        ))}
        {UserProtectedRouter.map((route, idx) => (
          <React.Fragment key={idx}>
            <Route
              path={route.path}
              element={
                <UserAuthProtected>
                  {<route.component />}
                </UserAuthProtected>
              }
            />
          </React.Fragment>
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
