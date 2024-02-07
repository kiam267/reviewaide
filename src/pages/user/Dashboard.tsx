import CustomeContainer from 'Components/Common/CustomeContainer';
import TopCities from 'Components/TopCities';
import SalesAnalytics from 'Components/sales-analytics';

import { Col, Empty, Row } from 'antd';
import { getUser } from 'api/createUsers';
// import { userGet } from 'api/UserUpdate';
import React, { useEffect } from 'react';
import { Row as ReactstrapRow, Card, CardBody } from 'reactstrap';
import { useUserAuth } from 'contexts/UserAuth';
function Dashboard() {
  const { LogoutUser } = useUserAuth();
  // useEffect(() => {
  //   userGet().then(user => {
  //     console.log(user);

  //     // if (!user?.valid) {
  //     //   LogoutUser();
  //     // }
  //     // localStorage.setItem('isValid', user.isValid);
  //   });
  // }, []);
  const data = [
    {
      name: 'Private Review',
      total: 12,
      color: '#556EE6',
    },
    {
      name: 'Publice Review',
      total: 302,
      color: '#34C38F',
    },
  ];
  const toclient = [
    {
      name: 'kiam',
      total: 50,
      percentage: 60,
      color: 'success',
    },
    {
      name: 'kiam',
      total: 50,
      percentage: 60,
      color: 'warning',
    },
    {
      name: 'kiam',
      total: 50,
      percentage: 60,
      color: 'primary',
    },
  ]; 
  return (
    <CustomeContainer>
      <Row gutter={16}>
        <Col sm={24} md={8}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium">Patient</p>
                  <h4 className="mb-0">12,544</h4>
                </div>
                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                  <span
                    className="avatar-title rounded-circle"
                    style={{ background: '#F6653F' }}
                  >
                    <i className={'bx ' + 'bxs-user ' + ' font-size-24'}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={24} md={8}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium">Pending Review</p>
                  <h4 className="mb-0">{12}</h4>
                </div>
                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                  <span
                    className="avatar-title rounded-circle"
                    style={{ background: '#F6653F' }}
                  >
                    <i className={'bx ' + 'bxs-star' + ' font-size-24'}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={24} md={8}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium"> Private Review </p>
                  <h4 className="mb-0">{12}</h4>
                </div>
                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                  <span
                    className="avatar-title rounded-circle "
                    style={{ background: '#F6653F' }}
                  >
                    <i
                      className={'bx ' + 'bxs-star-half' + ' font-size-24'}
                    ></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ReactstrapRow>
        <SalesAnalytics data={data} name="Review" />
        <TopCities
          name="Method"
          method="Total Message Send"
          total={500}
          data={toclient}
        />
      </ReactstrapRow>
    </CustomeContainer>
  );
}

export default Dashboard;
