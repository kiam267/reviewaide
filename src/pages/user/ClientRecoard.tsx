import CustomeContainer from 'Components/Common/CustomeContainer'
import React from 'react'
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  name: string;
  logo: string;
  google_link: string;
  facebook_link: string;
  review_link: string;
  qr_code: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Logo',
    dataIndex: 'logo',
    key: 'logo',
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
    title: 'Review Link',
    dataIndex: 'review_link',
    key: 'review_link',
  },
  {
    title: 'QR code',
    dataIndex: 'qr_code',
    key: 'qr_code',
  },

  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];
function ClientRecoard() {
  const data: DataType[] = [
    {
      name: 'John Brown',
      logo: 'kjjd',
      google_link: 'New York No. 1 Lake Park',
      facebook_link: 'http://www.facebook',
      qr_code: 'fdsflksjdkfsdf',
      review_link: 'dklfjsdfklsdfklsdjf'
    },

  ];
  return (
    <CustomeContainer>
      <Table columns={columns} dataSource={data} />
    </CustomeContainer>
  );
}

export default ClientRecoard