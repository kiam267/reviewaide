import axios from 'axios';
import {
  CLIENT_VISITOR,
  LINK as link,
  PRIVATE_REVIEW,
} from '../helpers/url_helper';

interface Visitor {
  username: string;
  email: string;
  phone: number;
  date: string;
}
interface SendMethod {
  email: boolean;
  sms: boolean;
  both: boolean;
}
interface Review {
  subject: string;
  textarea: string;
  clientId : string;
}

export const clientVisitor = (visitor: Visitor, sendMethod: SendMethod) => {
  const { username, email, phone, date } = visitor;
  return axios.post(CLIENT_VISITOR, {
    username,
    email,
    phone,
    date,
    link,
    sendMethod,
  });
};

export const getReview = clientId => {
  return axios.get(CLIENT_VISITOR, {
    params: {
      clientId: clientId,
    },
  });
};

export const privateReview = (review: Review) => {
  const { subject, textarea, clientId } = review;
  return axios.post(PRIVATE_REVIEW, { subject, textarea, clientId });
};
