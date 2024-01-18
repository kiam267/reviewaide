import axios from 'axios';
import dateFormat from 'dateformat';
import { CREATE_USERS } from '../helpers/url_helper';
interface Uesrs {
  email: string;
  password: string;
}

export const createUsres = (admin: Uesrs) => {
  const { email, password } = admin;
  const now = new Date();
  const date =  dateFormat(now, 'dddd, mmmm dS, yyyy')
  return axios.post(CREATE_USERS, { password, email, date });
};
