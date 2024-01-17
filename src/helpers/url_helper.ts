//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";

// Server Start
const SERVER_API = process.env.REACT_APP_SERVER_API; 
export const ADMIN_REGISTER = SERVER_API + '/api/auth/register';
export const ADMIN_LOGIN = SERVER_API + '/api/auth/login';
export const CREATE_USERS = SERVER_API + '/api/users/create';
export const USER_LOGIN = SERVER_API + '/api/users/login';
export const USER_UPDATE = SERVER_API + '/api/users/update';
