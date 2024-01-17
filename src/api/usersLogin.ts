import axios from 'axios';
import { USER_LOGIN } from '../helpers/url_helper';

interface Login {
  email: string;
  password: string;
}

export const userLogin = (login: Login) => {
  const { email, password } = login;
  const isAdmin = false;
  return axios.post(USER_LOGIN, { password, email, isAdmin });
};
