import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, QRCode, Space, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import Logout from 'pages/auth/Logout';
import {
  USER_UPDATE_SHORTCUT,
  LINK,
  AVATER_IMAGE_URL,
} from '../../helpers/url_helper';
import Header from 'Layouts/user/Header';

interface DataType {
  name: string;
  logo: string;
  google_link: string;
  facebook_link: string;
  review_link: string;
  qr_code: string;
  yel_link: string;
  helth_link: string;
  unique_id: string;
  id: number | string;
  valid: number | string;
  user_email: string;
}

function DeleteLink() {
  const [validCookie, setValidCookie] = useState(false);
  const [backendData, setAllData] = useState<DataType[]>([
    {
      facebook_link: '',
      google_link: '',
      helth_link: '',
      logo: '',
      name: '',
      qr_code: '',
      review_link: '',
      yel_link: '',
      unique_id: '',
      user_email: '',
      id: '',
      valid: '',
    },
  ]);

  const deleteHandeler = id => {
    const token = localStorage.getItem('UserToken');
    axios
      .delete(`${USER_UPDATE_SHORTCUT}/${id}`, {
        headers: {
          token: token,
        },
      })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          setAllData(res.msg[0]);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  };
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios
      .get(USER_UPDATE_SHORTCUT, { headers: { token, LINK, AVATER_IMAGE_URL } })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          setAllData(res.msg[0]);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  }, []);

  if (validCookie) {
    return <Logout />;
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Google Link',
      dataIndex: 'google_link',
      key: 'google_link',
    },
    {
      title: 'Facebook Link',
      dataIndex: 'facebook_link',
      key: 'facebook_link',
    },
    {
      title: 'healthgrades Link',
      dataIndex: 'helth_link',
      key: 'helth_link',
    },
    {
      title: 'Yelp Link',
      dataIndex: 'yel_link',
      key: 'yel_link',
    },
    {
      title: 'Review Link',
      dataIndex: 'review_link',
      key: 'review_link',
      render: (_, code) => {
        return (
          <a href={LINK + 'review/shortcut/' + code.unique_id}>Review Link</a>
        );
      },
    },
    {
      title: 'QR code',
      dataIndex: 'qr_code',
      key: 'qr_code',
      render: (_, code) => {
        return (
          <QRCode
            value={LINK + 'review/shortcut/' + code.unique_id}
            status="active"
          />
        );
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button danger onClick={() => deleteHandeler(record.unique_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <CustomeContainer>
      <Table columns={columns} dataSource={backendData} scroll={{ x: 1500 }} />
    </CustomeContainer>
  );
}

export default DeleteLink;
