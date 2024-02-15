import CustomeContainer from 'Components/Common/CustomeContainer';
import { Avatar, Card, Col, Empty, Row, Skeleton, Switch } from 'antd';

import { Users } from 'api/createUsers';

import React, { useEffect, useState } from 'react';
const { Meta } = Card;
function Allusers(props) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Users().then(resp => {
      const res = resp.data;
      setUsers(res);
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <CustomeContainer>
      {users.length > 0 ? (
        <Row gutter={[100, 24]}>
          {users.map(
            (user: {
              id: number;
              user?: string;
              email: string;
              date: string;
            }) => (
              <Col sm={24} lg={12} key={user?.id}>
                <Card
                  actions={[
                    <i className="bx bxs-edit-alt"></i>,
                    <i className="bx bxs-trash-alt"></i>,
                  ]}
                >
                  <Skeleton
                    loading={loading}
                    avatar
                    active
                    paragraph={{ rows: 3 }}
                  >
                    <Row gutter={[40, 12]}>
                      <Col>
                        <Avatar
                          className="border rounded-2 "
                          size="large"
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user?.id}`}
                        />
                      </Col>
                      <Col className="pt-3">
                        <h5 className="fw-normal ">{user?.email}</h5>
                        <p className="text-body-tertiary">{user?.date}</p>
                      </Col>
                    </Row>
                  </Skeleton>
                </Card>
              </Col>
            )
          )}
        </Row>
      ) : (
        <Empty
          className="mt-5 py-5"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        ></Empty>
      )}
      {/* {users.map(user =>
        users.length === 0 ? (
          <Card
            style={{ width: 300, marginTop: 16 }}
            actions={[
              <i className="bx bxs-edit-alt"></i>,
              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active paragraph={{ rows: 3 }}>
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=600038" />
                }
              />
            </Skeleton>
          </Card>
        ) : (
          <Empty
            className="mt-5 py-5"
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          ></Empty>
        )
      )} */}
    </CustomeContainer>
  );
}

export default Allusers;
