import CustomeContainer from 'Components/Common/CustomeContainer';

import { Empty } from 'antd';
import { getUser } from 'api/createUsers';
import React, { useEffect } from 'react';
import { List } from 'reactstrap';

function Dashboard() {
  useEffect(() => {
    getUser().then(user => {
      localStorage.setItem('isValid', user.isValid);
    });
  }, []);
  return (
    <CustomeContainer>
      <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"></Empty>
    </CustomeContainer>
  );
}

export default Dashboard;
