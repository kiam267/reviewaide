import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import {
  CardBody,
  Container,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
} from 'reactstrap';
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
} from 'antd';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

//import thunk
// import { resetLoginMsgFlag, socialLogin } from 'slices/auth/login/thunk';
import Breadcrumbs from '../../Components/Common/Breadcrumb';
import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { allSendData, clientVisitor } from 'api/clientVisitor';
import CustomeContainer from 'Components/Common/CustomeContainer';
import type { TableProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import {
  getArrayFromLocalStorage,
  pushDataToArray,
  saveArrayToLocalStorage,
} from '../../helpers/localstorage';
import { use } from 'i18next';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { CLIENT_VISITOR, LINK } from '../../helpers/url_helper';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Logout from 'pages/auth/Logout';

const UserDashboard = (props: any) => {
  const [date, setDate] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [proccssData, setProcessData] = useState(
    getArrayFromLocalStorage('proccess_send_data')
  );
  const dispatch: any = useDispatch();
  const getLocalSendData = getArrayFromLocalStorage('proccess_send_data');
  const [loading, setLoading] = useState(true);
  const [buttonloading, setButtonLoading] = useState(false);
  const [method, setMethod] = useState('email');
  const [successSendData, setSuccessSendData] = useState([]);
  const [validCookie, setValidCookie] = useState(false);
  const [value, setValue] = useState();
  const miniMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  useEffect(() => {
    const now = new Date();
    setDate(dateFormat(now, 'ddd, mmm dS, yyyy'));
  }, []);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onChange = (e: RadioChangeEvent) => {
    setMethod(e.target.value);
  };
  const deleteHandler = id => {
    const updatedData = getLocalSendData.filter(item => item?.id !== id);
    saveArrayToLocalStorage('proccess_send_data', updatedData);
    setProcessData(updatedData);
  };
  const submitHandler = id => {
    const updatedData = getLocalSendData.filter(item => item?.id === id);
    const mainData = updatedData[0];
    console.log(mainData);

    // setButtonLoading(true);
    const token = localStorage.getItem('UserToken');

    axios
      .post(
        CLIENT_VISITOR,
        { ...mainData, LINK, token, method },
        { headers: { token } }
      )
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          miniMessage('error', res.msg.msg);
          return setButtonLoading(false);
        }
        if (res?.msg?.name === 'success') {
          const updatedData = getLocalSendData.filter(item => item?.id !== id);
          saveArrayToLocalStorage('proccess_send_data', updatedData);
          setProcessData(updatedData);
          miniMessage('success', res.msg.msg);
          return setButtonLoading(false);
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  };

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);

  // Form validation

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: '',
      email: '',
      phone: '',
      date: date,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your Patient Name '),
      email: Yup.string()
        .email()
        .required('Please Enter Your Patient Email')
        .trim(),
      phone: Yup.number().required('Please Enter Your Patient Number '),
      date: Yup.string().required('Please Enter Your Patient Date'),
    }),
    onSubmit: (values: any, { resetForm }) => {
      const data = { ...values, phone: value };
      pushDataToArray(getLocalSendData, data);
      saveArrayToLocalStorage('proccess_send_data', getLocalSendData);
      setProcessData(getLocalSendData);
      miniMessage('success', 'success added');
      resetForm();
    },
  });

  // useEffect(() => {
  //   if (error) {
  //     setTimeout(() => {
  //       dispatch(resetLoginMsgFlag());
  //     }, 3000);
  //   }
  // }, [dispatch, error]);

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
      {contextHolder}

      <Row gutter={[16, 16]} className="justify-content-end">
        <Col className="col-12">
          <Breadcrumbs title="Process" breadcrumbItem="Process" />
        </Col>
        <Col sm={6}>
          <button
            className="rounded-4 d-block m-auto "
            style={{ borderColor: '#F6653F', outline: 'none' }}
            onClick={showModal}
          >
            <Popover content="Add Message" trigger="hover">
              <i className="bx bx-plus fs-1 pe-auto"></i>
            </Popover>
          </button>
          <Space></Space>
        </Col>
      </Row>
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => <CancelBtn />}
      >
        <Form
          className="form-horizontal"
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Name</Label>
            <Input
              name="username"
              className="form-control"
              placeholder="jon"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.username || ''}
              invalid={
                validation.touched.username && validation.errors.username
                  ? true
                  : false
              }
            />
            {validation.touched.username && validation.errors.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Email</Label>
            <Input
              name="email"
              className="form-control"
              placeholder="jon@gmail.com"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.email || ''}
              invalid={
                validation.touched.email && validation.errors.email
                  ? true
                  : false
              }
            />
            {validation.touched.email && validation.errors.email ? (
              <FormFeedback type="invalid">
                {validation.errors.email}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Phone</Label>
            <Input
              name="phone"
              className="form-control"
              placeholder="+1 4843734025"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.phone || ''}
              invalid={
                validation.touched.phone && validation.errors.phone
                  ? true
                  : false
              }
            />
            {validation.touched.phone && validation.errors.phone ? (
              <FormFeedback type="invalid">
                {validation.errors.phone}
              </FormFeedback>
            ) : null}
          </div>

          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Date</Label>
            <Input
              name="date"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.date || ''}
              invalid={
                validation.touched.date && validation.errors.date ? true : false
              }
            />
            {validation.touched.date && validation.errors.date ? (
              <FormFeedback type="invalid">
                {validation.errors.date}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mt-3 d-grid">
            <button
              className="btn btn-block fw-bold text-white "
              type="submit"
              style={{ background: '#F6653F' }}
            >
              Add
            </button>
          </div>
        </Form>
      </Modal>

      <Row className="mt-5">
        <Col className="col-12">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={proccssData}
            renderItem={(item: {
              id?: number;
              username?: string;
              email?: string;
              date?: string;
              phone?: string;
            }) => (
              <List.Item key={item?.id}>
                <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                  <Card
                    className="red-3  shadow-sm rounded-5"
                    style={{ background: '#FFF6E9' }}
                  >
                    <Row gutter={[15, 32]} className="text-black">
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
                        <Popover content="Send Message " trigger="hover">
                          <Button
                            disabled={buttonloading}
                            type="primary"
                            shape="round"
                            onClick={() => submitHandler(item?.id)}
                            icon={
                              buttonloading ? (
                                <i className="bx bx-loader"></i>
                              ) : (
                                <i className="bx bxs-send"></i>
                              )
                            }
                            size={'middle'}
                          />
                        </Popover>
                      </Col>
                    </Row>
                  </Card>
                </Skeleton>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </CustomeContainer>
  );
};

export default withRouter(UserDashboard);
