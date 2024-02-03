import CustomeContainer from 'Components/Common/CustomeContainer';
import withRouter from 'Components/Common/withRouter';
import { Empty } from 'antd';

import React from 'react'
import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  return (
    <CustomeContainer>
      <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"></Empty>
    </CustomeContainer>
  );
}

export default withRouter(Chat);
