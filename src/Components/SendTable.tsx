import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Popover,
  Button,
  Modal,
  Space,
  Skeleton,
  Empty,
  Switch,
  List,
  Avatar,
  Card,
  Table,
  Tag,
  Radio,
  message,
  Checkbox,
  RadioChangeEvent,
} from 'antd';
import {
  getArrayFromLocalStorage,
  pushDataToArray,
  pushDataToArrayTwo,
  saveArrayToLocalStorage,
} from '../helpers/localstorage';
import user from 'Layouts/user';
import { result } from 'lodash';
const SendTable = ({
  item,
  deleteHandler,
  buttonloading,
  sendEditHandler,
  checkMarkData,
  limit,
  setIsMarked,
  isMarked,
  setPropMethod,
}) => {
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('email');
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onChange = (e: RadioChangeEvent) => {
    setMethod(e.target.value);
    setPropMethod(e.target.value);
  };

  const [isMarked_1, setIsMarked_1] = useState(false);

  const SeletcMarkChange = () => {
    setIsMarked_1(!isMarked_1);
    setIsMarked(!isMarked);
  };


  return (
    <List.Item key={item?.id}>
      <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
        <Card
          className="red-3  shadow-sm rounded-5"
          style={{ background: '#FFF6E9' }}
        >
          <Row gutter={[15, 32]} className="text-black align-items-center">
            <Checkbox
              disabled={limit}
              className="me-4"
              checked={isMarked_1}
              onChange={() => {
                checkMarkData(item, isMarked_1, method);
                SeletcMarkChange();
              }}
            />
            <Col className="fw-bold">{item?.username}</Col>
            <Col>{item?.email}</Col>
            <Col>{item?.phone}</Col>
            <Col>{item?.date}</Col>
            <Col>
              <Radio.Group
                onChange={onChange}
                value={method}
                className="text-black "
              >
                <Radio className="text-black" value={'email'}>
                  Email
                </Radio>
                <Radio className="text-black" value={'sms'}>
                  SMS
                </Radio>
                <Radio className="text-black" value={'both'}>
                  Both
                </Radio>
              </Radio.Group>
            </Col>
            <Col>
              <Popover content="Delete Message " trigger="hover">
                <Button
                  type="primary"
                  shape="round"
                  danger
                  onClick={() => deleteHandler(item?.id)}
                  icon={<i className="bx bxs-trash"></i>}
                  size={'middle'}
                />
              </Popover>
            </Col>
            <Col>
              <Popover content="Edit Message " trigger="hover">
                <Button
                  disabled={buttonloading}
                  type="primary"
                  shape="round"
                  onClick={() => sendEditHandler(item)}
                  icon={<i className="bx bxs-edit-alt"></i>}
                  size={'middle'}
                />
              </Popover>
            </Col>
          </Row>
        </Card>
      </Skeleton>
    </List.Item>
  );
};

export default SendTable;
// function setProcessData(getLocalSendData: any) {
//   throw new Error('Function not implemented.');
// }
