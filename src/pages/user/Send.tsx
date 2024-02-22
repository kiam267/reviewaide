import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import InputMask from 'react-input-mask';
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
  Checkbox,
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
import { useNavigate } from 'react-router-dom';
import Logout from 'pages/auth/Logout';
import csvToJson from 'convert-csv-to-json';
import SendTable from 'Components/SendTable';

const UserDashboard = (props: any) => {
  const [date, setDate] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [proccssData, setProcessData] = useState(
    getArrayFromLocalStorage('proccess_send_data')
  );
  const [sendProcessData, setSendProcessData] = useState<UserId[]>([]);
  const dispatch: any = useDispatch();
  const [selectedItems, setSelectedItems] = useState<UserId[]>([]);
  const getLocalSendData = getArrayFromLocalStorage('proccess_send_data');
  const [loading, setLoading] = useState(true);
  const [buttonloading, setButtonLoading] = useState(false);
  const [method, setMethod] = useState('email');
  const [successSendData, setSuccessSendData] = useState([]);
  const [validCookie, setValidCookie] = useState(false);
  const [value, setValue] = useState([]);
  const [clear, setClear] = useState(false);
  const navigate = useNavigate();
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
  const onChange = () => {
    console.log('work');
    setClear(false);
    console.log(clear);
  };
  const checkMarkData = (item, valid, data) => {
    if (selectedItems.length < 10) {
      if (!valid) {
        item.method = data;
        setSelectedItems(prevSelectedItems => [...prevSelectedItems, item]);
      } else {
        setSelectedItems(prevSelectedItems =>
          prevSelectedItems.filter(e => e.id !== item.id)
        );
      }
    } else {
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(e => e.id !== item.id)
      );
      // setLimit(true);
      message.error('You can  only select 10 items');
    }
  };
  const [editItem, setEditItem] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    date: '',
  });
  const sendEditHandler = item => {
    setOpen(true);
    setEditItem(item);
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(e => e.id !== item.id)
    );
    const updatedData = getLocalSendData.filter(
      items => items?.id !== item.id
    );
    saveArrayToLocalStorage('proccess_send_data', updatedData);
    setProcessData(updatedData);
  };

  const deleteHandler = id => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(e => e.id !== id)
    );
    const updatedData = getLocalSendData.filter(item => item?.id !== id);
    saveArrayToLocalStorage('proccess_send_data', updatedData);
    setProcessData(updatedData);
  };
  const [sebmitDisabled, setDisabled] = useState(true);
  useEffect(() => {
    setDisabled(!(selectedItems.length > 0));
  }, [selectedItems]);
  const submitHandler = id => {
    const updatedData = getLocalSendData.filter(item => item?.id === id);
    const token = localStorage.getItem('UserToken');

    axios
      .post(
        CLIENT_VISITOR,
        { selectedItems, LINK, token, method },
        { headers: { token } }
      )
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          miniMessage('error', res.msg.msg);
          return setButtonLoading(false);
        }
        if (res?.msg?.name === 'success') {
          const selectedIds = selectedItems.map(item => item.id);
          const updatedData = getLocalSendData.filter(
            item => !selectedIds.includes(item.id)
          );
          saveArrayToLocalStorage('proccess_send_data', updatedData);
          setProcessData(updatedData);
          setSelectedItems([]);
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
      username: '' || editItem.username,
      email: '' || editItem.email,
      phone: editItem.phone || '+1',
      date: date || editItem.date,
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
      const data = { ...values };

      pushDataToArray(getLocalSendData, data);
      saveArrayToLocalStorage('proccess_send_data', getLocalSendData);
      setProcessData(getLocalSendData);
      miniMessage('success', 'success added');
      resetForm();
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const [limit, setLimit] = useState(false);

  const [isMarked, setIsMarked] = useState(false);

  const onLoad = () => {
    console.log('working');
    window.addEventListener('beforeunload', () => {});
  };

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
            onClick={() => {
              showModal();
              setEditItem({
                id: '',
                username: '',
                email: '',
                phone: '',
                date: '',
              });
            }}
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
        <Popover
          content={
            <div className="w-75 px-3">
              <Button
                disabled={sebmitDisabled}
                className="d-flex justify-content-center align-items-center my-3"
                onClick={submitHandler}
              >
                <i className="bx bx-mail-send fs-3 px-2"></i>
                <span>Send All</span>
              </Button>
              <Button
                // disabled
                className="d-flex justify-content-center align-items-center my-3"
                onClick={onLoad}
              >
                <i className="bx bx-x fs-3 px-2"></i>
                <span>Clear All</span>
              </Button>
            </div>
          }
          trigger="click"
        >
          <Button
            htmlType="button"
            className="ms-2 rounded-5"
            // onClick={submitHandler}
          >
            <i className="bx bx-dots-horizontal-rounded fs-2"></i>
          </Button>
        </Popover>
        <Col className="col-12">
          <div>
            {/* <Checkbox
              // disabled={limit}
              className="me-4"
              checked={isMarked}
              onChange={SeletcMarkChange}
            /> */}
            {/* <Label>Selected All</Label> */}
          </div>
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
              <>
                <SendTable
                  item={item}
                  setIsMarked={setIsMarked}
                  isMarked={isMarked}
                  limit={limit}
                  setPropMethod={setMethod}
                  deleteHandler={deleteHandler}
                  sendEditHandler={sendEditHandler}
                  buttonloading={buttonloading}
                  checkMarkData={checkMarkData}
                />
              </>
            )}
          />
        </Col>
      </Row>
    </CustomeContainer>
  );
};

export default withRouter(UserDashboard);
