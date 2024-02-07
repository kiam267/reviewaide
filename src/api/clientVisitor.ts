import axios from 'axios';
import {
  CLIENT_VISITOR,
  CLIENT_VISITOR_GET,
  LINK as link,
  PRIVATE_REVIEW,
} from '../helpers/url_helper';

interface Visitor {
  id: number;
  username: string;
  email: string;
  phone: number;
  date: string;
}
type SendMethod = 'sms' | 'email' | 'both';
interface Review {
  rating: string;
  textarea: string;
  clientId: string;
}

const token = localStorage.getItem('UserToken');

export const clientVisitor = (visitor, sendMethod) => {
  const { username, email, phone, date } = visitor[0];
  return axios.post(CLIENT_VISITOR, {
    username,
    email,
    phone,
    link,
    token,
    sendMethod,
  });
};

export const allSendData = () => {
  return axios.get(CLIENT_VISITOR, {
    params: {
      token,
    },
  });
};

export const getReview = clientId => {
  return axios.get(CLIENT_VISITOR_GET, {
    params: {
      clientId: clientId,
    },
  });
};

export const privateReview = (review: Review) => {
  const { rating, textarea, clientId } = review;
  return axios.post(PRIVATE_REVIEW, { rating, textarea, clientId });
};
export const getPrivateReview = () => {
  return axios.get(PRIVATE_REVIEW, {
    params: {
      token,
    },
  });
};
