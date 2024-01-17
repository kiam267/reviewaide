import axios from 'axios';
import { USER_UPDATE } from '../helpers/url_helper';


interface UserUpdate {
  email: string;
  password: string;
  date: string;
}
export const userUpdate = (userUpdate: UserUpdate) => {
  const token: string | null = localStorage.getItem('UserToken');  
  const { email, password, date } = userUpdate;
  
  return axios.put(USER_UPDATE, { password, email, date, token });
};
