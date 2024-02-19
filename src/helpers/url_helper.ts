// Server Start

// export const REACT_APP_SERVER_API = 'https://docapt.com/';
export const REACT_APP_SERVER_API = 'http://localhost:8080/';
const SERVER_API = REACT_APP_SERVER_API;
export const ADMIN_REGISTER = SERVER_API + 'api/auth/register';
export const ADMIN_LOGIN = SERVER_API + 'api/auth/login';
export const FORGET_PASSWORD_USER = SERVER_API + 'api/users/forget-password';
export const RESET_PASSWORD_USER = SERVER_API + 'api/users/reset-password';
export const POST_RESET_PASSWORD_USER =
  SERVER_API + 'api/users/post-reset-password';
export const CREATE_USERS = SERVER_API + 'api/users/create';
export const GET_USERS = SERVER_API + 'api/users/users';
export const GET_USERS_DASHBOARD = SERVER_API + 'api/users/';
export const GET_USERS_MINI_UPDATE = SERVER_API + 'api/users/mini-update';
export const USER_LOGIN = SERVER_API + 'api/users/login';
export const USER_UPDATE = SERVER_API + 'api/users/update';
export const CLIENT_VISITOR = SERVER_API + 'api/client/';
export const CLIENT_VISITOR_GET = SERVER_API + 'api/client/review';
export const CLIENT_QR_CODE_OPEN_REVIEW_GET = SERVER_API + 'api/review/open-review';
export const QRCODE_GEN_VISITOR = SERVER_API + 'api/client/qr_gen';
export const QRCODE_GEN_VISITOR_DELETE = SERVER_API + 'api/client/qr_gen';
export const QRCODE_GEN_VISITOR_CREATE = SERVER_API + 'api/client/qr_gen';
export const CLIENT_VISITOR_METHODS = SERVER_API + 'api/client/methods';
export const CLIENT_VISITOR_UNSUBSCRIBE = SERVER_API + 'api/client/unsubscribe';
export const ADMIN_GET = SERVER_API + 'api';
export const PRIVATE_REVIEW = SERVER_API + 'api/review/private';
export const QR_CODE_PRIVATE_REVIEW = SERVER_API + 'api/review/opne-qr-code-store';
export const CUSSTOMER_SUPPORT_EMAIL = SERVER_API + 'api/customer/email';
export const USER_MARKETING_STORE = SERVER_API + 'api/marketing';

// export const LINK = 'https://docapt.com/';
// export const AVATER_IMAGE_URL = 'https://docapt.com/';
// export const RESETPASSWORD_LINK = 'https://docapt.com';
// export const REVIEW_LOGO_LINK = 'https://docapt.com';
// export const SERVER_LINK = 'https://docapt.com/';

export const LINK = 'http://localhost:3000/';
export const AVATER_IMAGE_URL = 'http://localhost:8080/';
export const RESETPASSWORD_LINK = 'http://localhost:3000';
export const REVIEW_LOGO_LINK = 'http://localhost:8080';
export const SERVER_LINK = 'http://localhost:8080/';
