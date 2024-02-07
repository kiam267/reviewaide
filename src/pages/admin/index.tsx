import React, { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import Breadcrumb from 'Components/Common/Breadcrumb';
import AllContainer from 'Components/Common/CustomeContainer';
import SalesAnalytics from '../../Components/sales-analytics';
import TopCities from 'Components/TopCities';
import { get } from 'api/dashboardGet';
import { Empty } from 'antd';

const Dashboard = () => {
  document.title = 'Dashboards';
  return (
    <div>
      <AllContainer>
        <Row>
          {/* <SalesAnalytics /> */}
          {/* <TopCities /> */}
          <Empty className='mt-5 py-5' image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"></Empty>
        </Row>
      </AllContainer>
    </div>
  );
};

export default Dashboard;
