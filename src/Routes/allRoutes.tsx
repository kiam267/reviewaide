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
  TeamWork,
  UpdateProfile,
} from 'pages/user';
import AdminLogout from 'pages/auth/AdminLogout';
import Profile from 'Layouts/admin/Profile';
import ResetPassword from 'pages/user/ResetPassword';
import Unsubscribe from 'pages/user/Unsubscribe';

const authProtectedRoutes = [
  { path: '/auth/dashboard', component: <Dashboard /> },
  { path: '/auth/createUsers', component: <CreateUsers /> },
  { path: '/auth/allUsers', component: <Allusers /> },
  { path: '/auth/email', component: <Email /> },
  { path: '/auth/private-review', component: <PrivateReview /> },
  { path: '/auth/public-review', component: <PublicReview /> },
  { path: '/auth/public-review', component: <PublicReview /> },
  {
    path: '/auth',
    exact: true,
    component: <Navigate to="/auth/login" />,
  },
];

const publicRoutes = [
  // Admin Public Router
  { path: '/auth/register', component: <SignUp /> },
  { path: '/auth/login', component: <Login /> },
  { path: '/logout', component: <Logout /> },
  { path: '/auth/logout', component: <AdminLogout /> },
  // { path: '/forgot-password', component: <ForgotPassword /> },
  { path: '/user/forgot-password', component: <ForgotPassword /> },
  { path: '/review/:clientId', component: <Review /> },
  { path: '/user/reset-password/:id/:token', component: <ResetPassword /> },
  { path: '/user/unsubscribe/:id', component: <Unsubscribe/> },
  // { path: '/review', component: <Review /> },

  //User Public Router
  { path: '/login', component: <UserLogin /> },
  { path: '*', component: <Pages404 /> },
];
const UserProtectedRouter = [
  { path: '/user', component: userDashboard },
  { path: '/user/send', component: Send },
  { path: '/user/patient_record', component: PatientRecord },
  { path: '/user/teamwork', component: TeamWork },
  { path: '/user/private', component: PrivateReview },
  { path: '/user/publice', component: PublicReview },
  { path: '/user/customer_support', component: CustomerSupport },
  { path: '/user/profile', component: UpdateProfile },
  { path: '/user/logout', component: Logout },
  { path: '/user/newProfie', component: Profile },

];
export { authProtectedRoutes, publicRoutes, UserProtectedRouter };
