import axios from 'axios';
import { ADMIN_LOGIN } from '../helpers/url_helper';

interface Admin {
  email: string;
  password: string;
}

export const login = (admin: Admin) => {
  const { email, password } = admin;
  return axios.post(ADMIN_LOGIN, { password, email});
};
