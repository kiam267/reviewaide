import { Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Auth
import Login from 'pages/Authentication/login';
import Logout from 'pages/Authentication/Logout';
import UserProfile from 'pages/Authentication/user-profile';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import SignUp from 'pages/Authentication/Register';
import Email from 'pages/Dashboard/Email';
import PrivateReview from 'pages/Dashboard/PrivateReview';
import PublicReview from 'pages/Dashboard/PublicReview';
import CreateUsers from 'pages/Dashboard/CreateUsers';
import UserLogin from 'pages/Authentication/userLogin';
import UserDashboard from 'pages/Users/UserDashboard';
import Pages404 from '../pages/pages-404';
import WelComeback from 'pages/Dashboard/WelComeback';
import Allusers from 'pages/Dashboard/Allusers';
import CustomerSupport from 'pages/Users/CustomerSupport';
import UpdateProfile from 'pages/Users/UpdateProfile';

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
  { path: '/forgot-password', component: <ForgotPassword /> },

  //User Public Router
  { path: '/login', component: <UserLogin /> },
  { path: '*', component: <Pages404 /> },
];
const UserProtectedRouter = [
  { path: '/user', component: <UserDashboard /> },
  { path: '/user/customer_support', component: <CustomerSupport /> },
  { path: '/user/profile', component: <UpdateProfile /> },
  {
    path: '/',
    exact: true,
    component: <Navigate to="/login" />,
  },
];
export { authProtectedRoutes, publicRoutes, UserProtectedRouter };
