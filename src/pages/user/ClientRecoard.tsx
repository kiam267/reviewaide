import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import { Empty, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import UsersLayout from 'Layouts/user';
import { useGetUser } from 'api/userApi';
import UserAuth from 'pages/user-auth/user-auth';
import { Navigate } from 'react-router-dom';
import UserForm from 'Components/UserForm';
import { Rating } from 'react-simple-star-rating';
import { useGetClient } from 'api/clientApi';
import dateFormat from 'dateformat';
type Method = 'facebook' | 'google' | 'private';

export interface Client {
  companyName?: string;
  method: Method;
  private?: string;
  rating: number;
  clientName: string;
  date: any;
}

const columns: TableProps<Client>['columns'] = [
  {
    title: 'Client Name',
    dataIndex: 'clientName',
    key: 'clientName',
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    render: (_, data) => {
      if (data.method === 'private') {
        return (
          <Tag color="error" className="fs-6 fw-bold">
            {data.method}
          </Tag>
        );
      }
      if (data.method === 'facebook') {
        return (
          <Tag color="green" className="fs-6 fw-bold">
            {data.method}
          </Tag>
        );
      }
      return (
        <Tag color="geekblue" className="fs-6 fw-bold">
          {data.method}
        </Tag>
      );
    },
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    render: (_, data) => {
      return (
        <Rating
          className="d-block pb-2"
          size={20}
          initialValue={data.rating}
          transition
          readonly
        />
      );
    },
  },
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date',
    render: (_, data) => {
      const dateData = dateFormat(data.date, 'ddd, mmm dS, yyyy');
      return <p>{dateData}</p>;
    },
  },
];

function ClientRecoard() {
  const sesstion = localStorage.getItem('user-token');
  const { getUerInfo, isPending } = useGetUser(sesstion as string);
  const [clientSearch, setClientSearch] = useState<ClientSearchState>({
    page: 1,
    clientName: '',
    method: '',
  });

  const { getClientInfo, refetch } = useGetClient(sesstion, clientSearch);

  const userData = getUerInfo;
  useEffect(() => {
    refetch();
  }, [clientSearch]);

  const handlePageChange = (page: number) => {
    setClientSearch(prevState => ({
      ...prevState,
      page,
    }));
  };
  const data: Client[] = [
    {
      clientName: 'John Brown',
      rating: 3,
      method: 'google',
      date: '34897534895',
    },
  ];


  if (getClientInfo?.tokenInvalid) {
    return <Navigate to="/logout" />;
  }

  if (isPending) {
    return <>Loading... </>;
  }



  return (
    <>
      {!userData?.verify ? (
        <>
          <UserAuth>
            <UserForm />
          </UserAuth>
        </>
      ) : (
        <UsersLayout>
          <CustomeContainer>
            {getClientInfo?.pagination.total ? (
              <Table
                key={Math.random() * Date.now()}
                columns={columns}
                dataSource={getClientInfo?.data as unknown as Client[]}
                pagination={{
                  pageSize: 10,
                  //@ts-ignore
                  total: getClientInfo?.pagination.total | 0,
                  current: getClientInfo?.pagination?.page || 0, // Set the current page
                  onChange: handlePageChange, // Pass the handlePageChange function
                }}
              />
            ) : (
             
              <Empty />
            )}
          </CustomeContainer>
        </UsersLayout>
      )}
    </>
  );
}

export default ClientRecoard;
