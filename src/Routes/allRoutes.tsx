import { Navigate } from 'react-router-dom';


// Auth
import Login from 'pages/auth/login';
import Logout from 'pages/auth/Logout';
import ForgotPassword from 'pages/user-auth/forgot-password';
import SignUp from 'pages/auth/Register';
import PrivateReview from 'pages/review/PrivateReview';


import Pages404 from '../pages/pages-404';
import Allusers from 'pages/admin/Allusers';

import { UpdateProfile, QRcode, ClientRecoard } from 'pages/user';
import AdminLogout from 'pages/auth/AdminLogout';
import ResetPassword from 'pages/user-auth/reset-password';
import ShortcutReview from 'pages/user/ShortcutReview';
import UserAuth from 'pages/user-auth/user-auth';

import { lazy } from 'react';

// User Details
const UserLogin = lazy(() => import('pages/user-auth/user-login'));
const UserSignUp = lazy(() => import('pages/user-auth/user-signup'));
const AdminAuthProtectedRouter = [
  // { path: '/super-admin/createUsers', component: <CreateUsers /> },
  { path: '/super-admin/allUsers', component: <Allusers /> },
  // { path: '/super-admin/email', component: <Email /> },
  // { path: '/super-admin/private-review', component: <PrivateReview /> },
  {
    path: '/super-admin',
    exact: true,
    component: <Navigate to="/super-admin/login" />,
  },
];

const publicRoutes = [
  // Admin Public Router
  { path: '/super-admin/register', component: <SignUp /> },
  { path: '/super-admin/login', component: <Login /> },
  { path: '/logout', component: <Logout /> },
  { path: '/super-admin/logout', component: <AdminLogout /> },
  // { path: '/forgot-password', component: <ForgotPassword /> },
  { path: '/user/forgot-password', component: <ForgotPassword /> },
  { path: '/user/reset-password/:id/:token', component: <ResetPassword /> },
  //User Public Router
  { path: 'review/shortcut/:id', component: <ShortcutReview /> },
  {
    path: '/',
    component: (
      <UserAuth>
        <UserLogin />
      </UserAuth>
    ),
  },
  {
    path: '/sign-up',
    component: (
      <UserAuth>
        <UserSignUp />
      </UserAuth>
    ),
  },
  { path: '*', component: <Pages404 /> },
];

const UserProtectedRouter = [
  { path: '/user', component: ClientRecoard },
  { path: '/user/qrcodegen', component: QRcode },
  { path: '/user/private', component: PrivateReview },
  { path: '/user/profile', component: UpdateProfile },
];
export { AdminAuthProtectedRouter, publicRoutes, UserProtectedRouter };
