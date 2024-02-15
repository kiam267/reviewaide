import React, { useEffect, useState } from 'react';

import Breadcrumb from 'Components/Common/Breadcrumb';
import CustomeContainer from 'Components/Common/CustomeContainer';
import { Card, Col, List, Rate, Row, Skeleton, message } from 'antd';
import { getPrivateReview } from 'api/clientVisitor';
import axios from 'axios';
import { PRIVATE_REVIEW } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';

function PrivateReview(props) {
  const [review, setReview] = useState([]);
  const [validCookie, setValidCookie] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(review);

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios
      .get(PRIVATE_REVIEW, {
        headers: {
          token,
        },
      })
      .then(resp => {
       const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          // setAllData(res.msg[0].data);
          setReview(res.msg[0].data);
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Breadcrumb title="private Review" breadcrumbItem="Private Review" />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={review}
        renderItem={(item: {
          email: string;
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
                  <Col span={24}>
                    <h6 className="fs-6 text-capitalize">{item?.email}</h6>
                  </Col>
                  <Col span={24} className="text-body-tertiary">
                    {item?.textarea}
                  </Col>
                  <Col className="fw-semibold fs-6 bg-info rounded-5 px-3 py-2 text-white">
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
