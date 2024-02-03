import axios from 'axios';
import dateFormat from 'dateformat';
import { CREATE_USERS, GET_USERS } from '../helpers/url_helper';
interface Uesrs {
  email: string;
  password: string;
}

const token = localStorage.getItem('adToken');
export const createUsres = (admin: Uesrs) => {
  const { email, password } = admin;
  const now = new Date();
  const date = dateFormat(now, 'dddd, mmmm dS, yyyy');
  return axios.post(CREATE_USERS, { password, email, date });
};

export const getUser = () => {
 const token  = localStorage.getItem('UserToken');
  return axios.get(CREATE_USERS, {
    params: {
      token
    },
  });
};
export const Users = () => {
  return axios.get(GET_USERS, {
    params: {
      token,
    },
  });
};
