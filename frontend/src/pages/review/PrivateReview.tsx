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
function PrivateReview() {
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
  // interface PrivateFeedback {
  //   clientName: string;
  //   createdAt: string;
  //   email: string;
  //   id: number;
  //   method: string;
  //   private: string;
  //   rating: number;
  //   uniqueId: number;
  // }
  const clientData: RawPrivateFeedback[] = [
    {
      id: 1,
      username: 'John Brown',
      email: 'john@example.com',
      rating: 2,
      textarea: 'Great service!',
      date: '2026-07-30T10:30:00Z',
    },
  ];
  console.log(
    getClientInfo?.response.data,
    'private review',
  );

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
        dataSource={getClientInfo?.response.data || []}
        renderItem={(item: RawPrivateFeedback) => {
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
                        {item.username}
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
                      {item?.textarea}
                    </Col>
                    <Col
                      className="fw-semibold fs-6 rounded-5 px-3 py-2 text-white"
                      style={{
                        background: '#F6653F',
                      }}
                    >
                      <Date dateData={item?.date} />
                    </Col>
                  </Row>
                </Card>
              </Skeleton>
            </List.Item>
          );
        }}
      />
      {/* <Pagination
        className="mt-2 p-2 d-flex justify-content-end "
        pageSize={10}
        defaultCurrent={getClientInfo?.pagination?.page}
        total={getClientInfo?.pagination?.total}
        onChange={handlePageChange}
      /> */}
    </CustomeContainer>
  );
}

function Date({ dateData }: { dateData: string }) {
  const date = dateFormat(dateData, 'ddd, mmm dS, yyyy');
  return <span>{date} </span>;
}

export default PrivateReview;
