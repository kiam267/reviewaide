import React, { useEffect, useState } from 'react';

import Breadcrumb from 'Components/Common/Breadcrumb';
import CustomeContainer from 'Components/Common/CustomeContainer';
import { Card, Col, List, Rate, Row, Skeleton } from 'antd';
import { getPrivateReview } from 'api/clientVisitor';

function PrivateReview(props) {
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPrivateReview().then((res) => {
      setReview(res.reverse());
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <CustomeContainer>
      <Breadcrumb title="private Review" breadcrumbItem="Private Review" />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={review}
        renderItem={(item: {
          rating?: string;
          textarea: string;
          username?: string;
          date?: string;
        }) => (
          <List.Item key={new Date().getDate()}>
            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              <Card className="red-3" style={{ background: '#f0f0f0' }}>
                <Row gutter={[15, 32]} className="text-black">
                  <Col span={24}>
                    <Rate disabled defaultValue={Number(item.rating)} />
                  </Col>
                  <Col span={24}>
                    <h3 className="fs-3 text-capitalize">{item?.username}</h3>
                  </Col>
                  <Col span={24} className="text-body-tertiary">
                    {item?.textarea}
                  </Col>
                  <Col
                    className="fw-semibold fs-6 bg-info rounded-5 px-3 py-2 text-white"
                  >
                    {item?.date}
                  </Col>
                </Row>
              </Card>
            </Skeleton>
          </List.Item>
        )}
      />
    </CustomeContainer>
  );
}

export default PrivateReview;
