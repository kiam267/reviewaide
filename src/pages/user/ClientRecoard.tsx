import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import { Avatar, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
  AVATER_IMAGE_URL,
  USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST,
} from '../../helpers/url_helper';
import axios from 'axios';

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
  const [mainData, setData] = useState([
    {
      company_name: '',
      logo: '',
      date: '',
      method: '',
    },
  ]);
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios
      .get(USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST, {
        headers: {
          token,
        },
      })
      .then(resp => {
        const res = resp.data;
        console.log(res.msg);
        if (res.msg.name === 'success') {
          return setData(res.msg[0].data);
        }
        if (res.msg.name === 'error') {
          // return setURLValid(res.msg[0].valid);
        }
        if (res.msg.name === 'auth') {
          // setValidCookie(true);
        }
      });
  }, []);

  const data: DataType[] = [
    {
      company_name: 'John Brown',
      logo: 'kjjd',
      method: 'google',
      date: '34897534895',
    },
  ];
  return (
    <CustomeContainer>
      <Table key={Date.now()} columns={columns} dataSource={mainData} />
    </CustomeContainer>
  );
}

export default ClientRecoard;
