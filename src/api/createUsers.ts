import axios from 'axios';
import { CREATE_USERS } from '../helpers/url_helper';
interface Uesrs {
  email: string;
  password: string;
}

export const createUsres = (admin: Uesrs) => {
  const { email, password } = admin;
  return axios.post(CREATE_USERS, { password, email});
};
