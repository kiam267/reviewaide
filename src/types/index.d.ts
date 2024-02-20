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

