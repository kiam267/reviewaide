import { Navigate } from 'react-router-dom';
import Dashboard from '../pages/admin';

// Auth
import Login from 'pages/auth/login';
import Logout from 'pages/auth/Logout';
import ForgotPassword from 'pages/auth/ForgotPassword';
import SignUp from 'pages/auth/Register';
import Email from 'pages/admin/Email';
import PrivateReview from 'pages/review/PrivateReview';
import PublicReview from 'pages/review/PublicReview';
import CreateUsers from 'pages/admin/CreateUsers';
import UserLogin from 'pages/auth/userLogin';
import Pages404 from '../pages/pages-404';
import Allusers from 'pages/admin/Allusers';
import CustomerSupport from 'pages/user/CustomerSupport';
import Review from 'pages/review/Review';

import {
  Dashboard as userDashboard,
  Send,
  PatientRecord,
  Marketing,
  UpdateProfile,
  QRcode,
  Shortcut,
  ClientRecoard,
  PrivateClient,
  DeleteLink,
} from 'pages/user';
import AdminLogout from 'pages/auth/AdminLogout';
import Profile from 'Layouts/admin/Profile';
import ResetPassword from 'pages/user/ResetPassword';
import Unsubscribe from 'pages/user/Unsubscribe';
import OpenReview from 'pages/review/OpenReview';
import ShortcutReview from 'pages/user/ShortcutReview';
import PubliceClientRecoard from 'pages/user/PubliceClientRecoard';
import PrivateReviewRecoard from 'pages/user/PrivateReviewRecoard';

const authProtectedRoutes = [
  { path: '/super-admin/dashboard', component: <Dashboard /> },
  { path: '/super-admin/createUsers', component: <CreateUsers /> },
  { path: '/super-admin/allUsers', component: <Allusers /> },
  { path: '/super-admin/email', component: <Email /> },
  { path: '/super-admin/private-review', component: <PrivateReview /> },
  { path: '/super-admin/public-review', component: <PublicReview /> },
  { path: '/super-admin/public-review', component: <PublicReview /> },
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
  { path: '/review/:clientId', component: <Review /> },
  { path: '/user/reset-password/:id/:token', component: <ResetPassword /> },
  { path: '/user/unsubscribe/:id', component: <Unsubscribe /> },
  // { path: '/review', component: <Review /> },
  { path: '/user/open-review/:id', component: <OpenReview /> },
  { path: 'review/shortcut/:id', component: <ShortcutReview /> },
  //User Public Router
  { path: '/login', component: <UserLogin /> },
  { path: '*', component: <Pages404 /> },
];

const publiceRecoardwithprivateReview = [
  { path: 'client-record/:id', component: <PubliceClientRecoard /> },
  { path: 'private-review-recoard', component: <PrivateReviewRecoard /> },
];
const UserProtectedRouter = [
  { path: '/user', component: userDashboard },
  { path: '/user/send', component: Send },
  { path: '/user/patient_record', component: PatientRecord },
  { path: '/user/marketing', component: Marketing },
  { path: '/user/qrcodegen', component: QRcode },

  { path: '/user/private', component: PrivateReview },
  { path: '/user/publice', component: PublicReview },
  { path: '/user/customer_support', component: CustomerSupport },
  { path: '/user/profile', component: UpdateProfile },
  { path: '/user/logout', component: Logout },
  { path: '/user/newProfie', component: Profile },
  { path: '/user/short-cut', component: Shortcut },
  { path: '/user/client_record', component: ClientRecoard },
  { path: '/user/short-cut-private-review', component: PrivateClient },
  { path: '/user/delete-link', component: DeleteLink },
];
export {
  authProtectedRoutes,
  publicRoutes,
  UserProtectedRouter,
  publiceRecoardwithprivateReview,
};
