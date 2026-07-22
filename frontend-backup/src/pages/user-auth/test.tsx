import React from 'react';
import { Button, message } from 'antd';

const TEST: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
  });

  const info = () => {
    messageApi.info('Hello, Ant Design!');
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </>
  );
};

export default TEST;
