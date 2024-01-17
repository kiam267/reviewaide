import React from 'react';
import { Container, Row } from 'reactstrap';
import Breadcrumb from 'Components/Common/Breadcrumb';
import WelComeback from './WelComeback';
import AllContainer from 'Components/Common/Container';
import SalesAnalytics from '../../Components/sales-analytics';
import TopCities from 'Components/TopCities';

const Dashboard = () => {
  document.title = 'Dashboards | Skote - React Admin & Dashboard Template';

  return (
    <div>
      <AllContainer>
        <Row>
          <SalesAnalytics />
          <TopCities />
        </Row>
      </AllContainer>
    </div>
  );
};

export default Dashboard;
