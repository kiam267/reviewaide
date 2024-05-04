declare module '@fullcalendar/react';
declare module '@fullcalendar/daygrid';
declare module '@fullcalendar/interaction';
declare module '@fullcalendar/bootstrap';
declare module 'react-star-ratings';
declare module 'nouislider-react';
declare module 'axios';
declare module 'firebase/compat/app';
declare module 'react-jvectormap';
declare module 'react-leaflet';
declare module '@vtaits/react-color-picker';
declare module 'react-bootstrap-editable';
declare module 'react-rating';
declare module 'toastr';
declare module 'react-chartjs-2';
declare module 'react-chartist';
declare module 'react-drag-listview';
declare module 'react-dropzone';
declare module 'react-scrollspy';
declare module 'moment';
declare module 'react-table';
declare module 'react-draft-wysiwyg';
declare module 'moment';
declare module 'typescript';
declare module 'google-maps-react';

interface UserData {
  company_name: string;
  date: string;
  email: string;
  facebook_link: string;
  google_link: string;
  phato_path: string;
  phone: string;
  temporaray_lock: string;
  uniqueId: string;
  username: string;
}

interface SendTableProps {
  date: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  phone: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  email: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  username: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  id: Key | null | undefined;
  item: {
    id?: number;
    username?: string;
    email?: string;
    date?: string;
    phone?: string;
  };
  deleteHandler: (arg: any) => void;
}
interface SendTableProps {
  item: {
    id?: number;
    username?: string;
    email?: string;
    date?: string;
    phone?: string;
  };
}
interface UserId {
  id: number;
  // ... other properties
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserSignUp {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface UserMoreDetailInfo {
  companyName: string;
  googleLink: string;
  facebookLink: string;
}
