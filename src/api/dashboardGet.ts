import axios from 'axios';
import { ADMIN_GET } from '../helpers/url_helper';



export const get = () => {
 return axios.get('https://docapt.com/');
};
