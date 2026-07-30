import React, { useEffect, useState } from 'react';

import Breadcrumb from '@/components/Common/Breadcrumb';
import CustomeContainer from '@/components/Common/CustomeContainer';
import {
  Card,
  Col,
  Empty,
  List,
  Pagination,
  Rate,
  Row,
  Skeleton,
} from 'antd';
import dateFormat from 'dateformat';
import Logout from '@/pages/auth/Logout';
import { useGetClient } from '@/hook/useClient';
function PrivateReview(props) {
  const sesstion = localStorage.getItem('user-token');
  const [clientSearch, setClientSearch] =
    useState<ClientSearchState>({
      page: 1,
      rating: 2,
      clientName: '',
      method: '',
    });

  const handlePageChange = (page: number) => {
    setClientSearch(prevState => ({
      ...prevState,
      page,
    }));
  };
  const {
    data: getClientInfo,
    refetch,
    isPending,
  } = useGetClient(clientSearch);
  useEffect(() => {
    refetch();
  }, [clientSearch]);
  interface ClientItme {
    clientName: string;
    createdAt: string;
    email: string;
    id: number;
    method: string;
    private: string;
    rating: number;
    uniqueId: number;
  }
  const clientData: ClientItme[] = [
    {
      id: 1,
      clientName: 'John Brown',
      email: 'john@example.com',
      rating: 4,
      method: 'google',
      private: 'no',
      uniqueId: 1001,
      createdAt: '2026-07-30T10:30:00Z',
    },
    {
      id: 2,
      clientName: 'Sarah Smith',
      email: 'sarah@example.com',
      rating: 5,
      method: 'facebook',
      private: 'yes',
      uniqueId: 1002,
      createdAt: '2026-07-29T08:15:00Z',
    },
    {
      id: 3,
      clientName: 'Michael Lee',
      email: 'michael@example.com',
      rating: 3,
      method: 'google',
      private: 'no',
      uniqueId: 1003,
      createdAt: '2026-07-28T14:45:00Z',
    },
    {
      id: 4,
      clientName: 'Emily Davis',
      email: 'emily@example.com',
      rating: 5,
      method: 'open_source',
      private: 'yes',
      uniqueId: 1004,
      createdAt: '2026-07-27T12:00:00Z',
    },
    {
      id: 5,
      clientName: 'David Wilson',
      email: 'david@example.com',
      rating: 2,
      method: 'google',
      private: 'no',
      uniqueId: 1005,
      createdAt: '2026-07-26T09:20:00Z',
    },
  ];

  // if (!getClientInfo?.pagination?.total) {
  //   return (
  //     <CustomeContainer>
  //       <Breadcrumb
  //         title="private Review"
  //         breadcrumbItem="Private Review"
  //       />
  //       <Empty />
  //     </CustomeContainer>
  //   );
  // }
  return (
    <CustomeContainer>
      <Breadcrumb
        title="private Review"
        breadcrumbItem="Private Review"
      />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={clientData as any}
        renderItem={(item: ClientItme) => {
          const checkItem = item.rating >= 4;

          if (checkItem) return null;
          return (
            <List.Item key={item.id}>
              <Skeleton
                loading={isPending}
                active
                paragraph={{ rows: 4 }}
              >
                <Card
                  className="red-3"
                  style={{ background: '#f0f0f0' }}
                >
                  <Row
                    gutter={[15, 32]}
                    className="text-black"
                  >
                    <Col span={24}>
                      <Rate
                        disabled
                        defaultValue={Number(item.rating)}
                      />
                    </Col>
                    <Col span={24}>
                      <h3 className="fs-3 text-capitalize">
                        {item.clientName}
                      </h3>
                    </Col>
                    <Col span={24}>
                      <h6 className="fs-6">
                        {item?.email}
                      </h6>
                    </Col>
                    <Col
                      span={24}
                      className="text-body-tertiary"
                    >
                      {item?.private}
                    </Col>
                    <Col
                      className="fw-semibold fs-6 rounded-5 px-3 py-2 text-white"
                      style={{
                        background: '#F6653F',
                      }}
                    >
                      <Date dateData={item?.createdAt} />
                    </Col>
                  </Row>
                </Card>
              </Skeleton>
            </List.Item>
          );
        }}
      />
      <Pagination
        className="mt-2 p-2 d-flex justify-content-end "
        pageSize={10}
        defaultCurrent={getClientInfo?.pagination?.page}
        total={getClientInfo?.pagination?.total}
        onChange={handlePageChange}
      />
    </CustomeContainer>
  );
}

function Date({ dateData }: { dateData: string }) {
  const date = dateFormat(dateData, 'ddd, mmm dS, yyyy');
  return <span>{date} </span>;
}

export default PrivateReview;
