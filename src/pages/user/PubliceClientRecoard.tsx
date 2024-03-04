import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import { Avatar, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
  AVATER_IMAGE_URL,
  USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST,
} from '../../helpers/url_helper';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'Components/Common/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { email } from '../../slices/dunamicProps';

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

function PubliceClientRecoard() {
  const dispatch = useDispatch();
  const { id } = useParams();
  dispatch(email(id));

  const [mainData, setData] = useState([
    {
      company_name: '',
      logo: '',
      date: '',
      method: '',
    },
  ]);
  useEffect(() => {
    axios
      .get(USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST, {
        headers: {
          id,
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
      <div
        style={{
          width: '80%',
          display: 'block',
          margin: 'auto',
        }}
      >
        <Breadcrumb title="Client Record" breadcrumbItem="Client Record" />
        <Table
          className="rounded"
          key={Date.now()}
          columns={columns}
          dataSource={mainData}
        />
      </div>
    </CustomeContainer>
  );
}

export default PubliceClientRecoard;
