import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import { Avatar, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
  AVATER_IMAGE_URL,
  USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST,
} from '../../helpers/url_helper';
import UsersLayout from 'Layouts/user';
import { useGetUser } from 'api/userApi';
import UserAuth from 'pages/user-auth/user-auth';
import { Navigate } from 'react-router-dom';
import UserForm from 'Components/UserForm';
interface DataType {
  company_name: string;
  logo: string;
  date: string;
  method: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Logo',
    dataIndex: 'logo',
    key: 'logo',
    render: (_, code) => {
      return (
        <Avatar
          src={
            <img
              alt="logo"
              src={`${AVATER_IMAGE_URL + 'api/photos/' + code.logo}`}
            />
          }
        />
      );
    },
  },
  {
    title: 'Company Name',
    dataIndex: 'company_name',
    key: 'company_name',
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date',
  },
];

function ClientRecoard() {
  const sesstion = localStorage.getItem('user-token');
  const { getUerInfo } = useGetUser(sesstion as string);
  const [isVerify, setIsVerify] = useState<boolean | undefined>();
  const [token, setToken] = useState<boolean | undefined>();
  const [mainData, setData] = useState([
    {
      company_name: '',
      logo: '',
      date: '',
      method: '',
    },
  ]);


  useEffect(() => {
    const data = getUerInfo;
    if (data?.verify) {
      setIsVerify(data?.verify );
    }
    if (data?.tokenInvalid) {
      setToken(data?.tokenInvalid);
    }
    
  }, []);

  const data: DataType[] = [
    {
      company_name: 'John Brown',
      logo: 'kjjd',
      method: 'google',
      date: '34897534895',
    },
  ];

  if (token) {
    return <Navigate to="/logout" />;
  }
  return (
    <>
      {!isVerify ? (
        <>
          <UserAuth>
            <UserForm/>
          </UserAuth>
        </>
      ) : (
        <UsersLayout>
          <CustomeContainer>
            <Table key={Date.now()} columns={columns} dataSource={mainData} />
          </CustomeContainer>
        </UsersLayout>
      )}
    </>
  );
}

export default ClientRecoard;
