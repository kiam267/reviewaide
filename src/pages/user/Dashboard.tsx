import CustomeContainer from 'Components/Common/CustomeContainer';
import TopCities from 'Components/TopCities';
import SalesAnalytics from 'Components/sales-analytics';

import { Col, Empty, Row, message } from 'antd';
import { getUser } from 'api/createUsers';
// import { userGet } from 'api/UserUpdate';
import React, { useEffect, useState } from 'react';
import { Row as ReactstrapRow, Card, CardBody } from 'reactstrap';
import { useUserAuth } from 'contexts/UserAuth';
import axios from 'axios';
import { GET_USERS_DASHBOARD } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';
import { precision } from 'chartist';
import { log } from 'console'
function Dashboard() {
  const { LogoutUser } = useUserAuth();
  const [validCookie, setValidCookie] = useState(false);
  const [allUsers, setAllUsers] = useState(0);
  const [pending, setPendingReview] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);
  const [publiceCount, setPubliceCount] = useState(0);
  const [smsCount, setSmsCount] = useState(0);
  const [emialCount, setEmailCount] = useState(0);
  const [bothCount, setbothCount] = useState(0);
  // const [publiceCount, setPubliceCount] = useState(0);
  const [method, setMethod] = useState(0);

  function calculateLegendPercentages(values) {
    // Step 1: Calculate the total sum of provided values
    const totalSum = values.reduce((sum, value) => sum + value, 0);

    // Step 2: Normalize the values to add up to 100%
    const normalizedPercentages = values.map(value => (value / totalSum) * 100);

    // Step 3: Ensure the total percentage is exactly 100% (adjust rounding errors)
    const roundingError =
      100 -
      normalizedPercentages.reduce((sum, percentage) => sum + percentage, 0);
    normalizedPercentages[0] += roundingError; // Add rounding error to the first value

    return normalizedPercentages;
  }

  // Example usage
  const values = [smsCount, emialCount, bothCount]; // Adjust values as needed
  const legendPercentages = calculateLegendPercentages(values);

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios.get(GET_USERS_DASHBOARD, { headers: { token } }).then(resp => {
      const res = resp.data;

      if (res?.msg?.name === 'success') {
        // message.success('success', res.msg.msg);
        setAllUsers(res.msg[0].data.length);
        setMethod(res.msg[0].data);
        let penCount = 0;
        let PriCount = 0;
        let PubCount = 0;
        let SmsCount = 0;
        let EmailCount = 0;
        let BothCount = 0;
        res.msg[0].data.map(r => {
          if (r.review_method === 'pending') {
            penCount++;
          }
          if (r.review_method === 'private') {
            PriCount++;
          }
          if (r.review_method === 'facebook' || r.review_method === 'google') {
            PubCount++;
          }
          if (r.method === 'sms') {
            SmsCount++;
          }
          if (r.method === 'email') {
            EmailCount++;
          }
          if (r.method === 'both') {
            BothCount++;
          }
        });
        setPendingReview(penCount);
        setPrivateCount(PriCount);
        setPubliceCount(PubCount);
        setSmsCount(SmsCount);
        setEmailCount(EmailCount);
        setbothCount(BothCount);
        setMethod(SmsCount + EmailCount + BothCount);
        return;
      }
      // if (res?.msg?.name === 'error') {
      //   message.error('error', res.msg.msg);
      //   return;
      // }

      if (res.msg.name === 'auth') {
        return setValidCookie(true);
      }
    });
  }, []);
  const data = [
    {
      name: 'Private Review',
      total: privateCount,
      color: '#556EE6',
    },
    {
      name: 'Publice Review',
      total: publiceCount,
      color: '#34C38F',
    },
  ];
  const toclient = [
    {
      name: 'sms',
      total: smsCount,
      percentage: legendPercentages[0],
      color: 'success',
    },
    {
      name: 'email',
      total: emialCount,
      percentage: legendPercentages[1],
      color: 'warning',
    },
    {
      name: 'both',
      total: bothCount,
      percentage: legendPercentages[2],
      color: 'primary',
    },
  ];
  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Row gutter={16}>
        <Col sm={24} md={8}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium">Patient</p>
                  <h4 className="mb-0">{allUsers}</h4>
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
                  <h4 className="mb-0">{pending}</h4>
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
                  <h4 className="mb-0">{privateCount}</h4>
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
          total={method}
          data={toclient}
        />
      </ReactstrapRow>
    </CustomeContainer>
  );
}

export default Dashboard;
function setPubliceCount(PubCount: number) {
  throw new Error('Function not implemented.');
}
