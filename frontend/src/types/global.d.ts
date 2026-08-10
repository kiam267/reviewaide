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
  date:
    | ReactI18NextChildren
    | Iterable<ReactI18NextChildren>;
  phone:
    | ReactI18NextChildren
    | Iterable<ReactI18NextChildren>;
  email:
    | ReactI18NextChildren
    | Iterable<ReactI18NextChildren>;
  username:
    | ReactI18NextChildren
    | Iterable<ReactI18NextChildren>;
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

interface Login {
  email: string;
  password: string;
}

interface SignUp {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface UserMoreDetailInfo {
  username: string;
  companyLogo?: any;
  fileDetails?: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
  id?: number;
  fullName?: string | undefined;
  password?: string;
  email?: string;
  phone?: string | undefined;
  userEmailText?: string;
  userSmsText?: string;
}

interface HeadeInfo {
  companyName?: string | null;
  companyLogo?: string | null;
}

interface ClientSearchState {
  page: number;
  clientName: string;
  method: string;
  rating?: number;
}

type UserStatus = 'active' | 'pending' | 'deactivated';
interface UserViaAdmin {
  response: {
    data: {
      data: RawUser[];
      pagination: {
        total: number;
        page: number;
        pages: number;
      };
    };
  };
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
}

interface UserViaAdminSeachState {
  page: number;
  searchUserName: string;
  searchUserStatus: string;
  searchUserEmail: string;
  searchCompanyName: string;
  searchPhoneNumber: string | number;
}

type UserUdateStatus = 'active' | 'pending' | 'deactivated';
interface DataType {
  id: number;
  fullName: string;
  password: string;
  email: string;
  phone: number;
  companyLogo: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
  userStatus: UserUdateStatus;
  createdAt: string;
}
type ResetPassword = {
  id: string | number | undefined;
  token: string | undefined;
  password: string;
};

interface RawUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  companyName: string;
  facebookLink: string;
  googleLink: string;
}

type User = {
  tokenInvalid?: boolean;
  message?: string;
  success: boolean;
  response: {
    data: {
      data: RawUser[];
    };
  };
  readonly redirect?: boolean;
  readonly verify: boolean;
};
type UpdateProfile = {
  data: UserMoreDetailInfo;
};
interface Header {
  success: boolean;
  message: string;
  tokenInvalid?: boolean | null;
  data: {
    username?: string;
  } | null;
}
interface Profile {
  success: boolean;
  message: string;
  tokenInvalid?: boolean | null;
  data: {
    id: number;
    username: string;
    fullName: string;
    password: string;
    email: string;
    phone: string;
    companyLogo: string;
    companyName: string;
    googleLink: string;
    facebookLink: string;
    userEmailText?: string;
    userSmsText?: string;
  } | null;
}
interface RawPrivateFeedback {
  username: string;
  textarea: string;
  rating: number;
  email?: string;
  id: number | undefined;
  date: string;
}

interface PrivateFeedback {
  response: {
    data: RawPrivateFeedback[];
  };
}
interface RawPublicFeedback {
  id: number;
  logo: string | null;
  userEmail: string;
  date: string; // MySQL datetime string
  method: string; // e.g. "google", "facebook"
  companyName: string;
  userEmialView: string | null;
  rating: string; // you can change to number if you store numeric
  createAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface PublicFeedback {
  response: {
    data: RawPublicFeedback[];
  };
}
interface ClientResponse {
  data?: {
    createdAt: Date;
    private: string;
    clientName: string;
    uniqueId: number;
    rating: number;
    method: 'facebook' | 'google' | 'private';
  };
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

type Method = 'facebook' | 'google';
interface CreateClient {
  id: string | undefined;
  method?: Method;
  clientName?: string;
  clientMessage?: string;
  rating?: number;
}
interface QRCodeGen {
  companyLogo: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
  companyLogo?: File | null;
}
interface ClientLinkResponse {
  response: VisitorLinkResponse;
}

type VisitorLinkResponse = {
  data:
    | [
        {
          uniqueId: string;
          companyName: string;
          companyLogo: string;
        },
      ]
    | null;
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
};
interface ClientLogoResponse {
  response: VisitorPublicResponse;
}

type VisitorPublicResponse = {
  data?: {
    companyLogo: string;
    facebookLink: string;
    googleLink: string;
  };
  success: boolean;
  message?: string;
  tokenInvalid: boolean;
};
