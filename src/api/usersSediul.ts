import axios from 'axios';
import { USER_SCHEDULE } from '../helpers/url_helper';

interface Sediul {
  email: string;
  phone: number;
  date: string;
}

export const userSchedule = (sediul: Sediul) => {
  const { email, phone, date } = sediul;
  return axios.post(USER_SCHEDULE, { phone, email, date });
};
