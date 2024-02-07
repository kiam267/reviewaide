import axios from 'axios';
import {
  CLIENT_VISITOR,
  CREATE_USERS,
  USER_UPDATE,
} from '../helpers/url_helper';

interface UserUpdate {
  email: string;
  password: string;
  date: string;
}
// const token: string | null = localStorage.getItem('UserToken');
export const userUpdate = (token: undefined, ...userUpdate: any[]) => {
  // const { email, password, date } = userUpdate;
  console.log(token);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: token,
    },
  };

  return axios.put(USER_UPDATE, ...userUpdate, config);
};
export const userGet = () => {
  return axios.get(CREATE_USERS);
};
