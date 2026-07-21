import React, { Suspense } from 'react';
import './App.css';
import './assets/scss/theme.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import {
  AdminAuthProtectedRouter,
  publicRoutes,
  UserProtectedRouter,
} from './Routes/allRoutes';
import AdminAuthProtected from './Routes/AdminAuthProtected';
import UserAuthProtected from './Routes/UserAuthProtected';

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
