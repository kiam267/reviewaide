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
  Upload,
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
import type { GetProp, UploadProps } from 'antd';
import {
  getArrayFromLocalStorage,
  pushDataToArray,
  saveArrayToLocalStorage,
} from '../../helpers/localstorage';
import { use } from 'i18next';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {
  CLIENT_VISITOR,
  LINK,
  USER_UPDATE,
  USER_UPDATE_SHORTCUT,
} from '../../helpers/url_helper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logout from 'pages/auth/Logout';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
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

  const [editItem, setEditItem] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    date: '',
  });

  const [sebmitDisabled, setDisabled] = useState(true);
  useEffect(() => {
    setDisabled(!(selectedItems.length > 0));
  }, [selectedItems]);
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const { error } = useSelector(selectProperties);
  const onFileChanged = info => {
    setImageURL(info.file.originFileObj);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.

      setLoading(false);
      getBase64(info.file.originFileObj as FileType, url => {
        console.log(url);

        setImageUrl(url);
      });
    }
  };
  // Form validation

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: '',
      google_link: '',
      facebook_link: '',
      heathGrade_link: '',
      yelp_link: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please Enter Your Company Name '),
    }),
    onSubmit: (values: any, { resetForm }) => {
      const data = { ...values, imageURL };
      console.log(data);

      const token = localStorage.getItem('UserToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      };
      axios.post(USER_UPDATE_SHORTCUT, data, config).then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          message.success(res?.msg?.msg);
          resetForm();
          setImageUrl('')
          setImageURL('')
           setLoading(false);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
    },
  });


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
            onClick={() => {
              showModal();
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
            <Label className="form-label">Company Name</Label>
            <Input
              name="name"
              className="form-control"
              placeholder="jon"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name || ''}
              invalid={
                validation.touched.name && validation.errors.name ? true : false
              }
            />
            {validation.touched.name && validation.errors.name ? (
              <FormFeedback type="invalid">
                {validation.errors.name}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Facebook Link</Label>
            <Input
              name="facebook_link"
              className="form-control"
              placeholder="https://www.facebook.com/"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.facebook_link || ''}
              invalid={
                validation.touched.facebook_link &&
                validation.errors.facebook_link
                  ? true
                  : false
              }
            />
            {validation.touched.facebook_link &&
            validation.errors.facebook_link ? (
              <FormFeedback type="invalid">
                {validation.errors.facebook_link}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Google Link</Label>
            <Input
              name="google_link"
              className="form-control"
              placeholder="https://www.google.com/"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.google_link || ''}
              invalid={
                validation.touched.google_link && validation.errors.google_link
                  ? true
                  : false
              }
            />
            {validation.touched.google_link && validation.errors.google_link ? (
              <FormFeedback type="invalid">
                {validation.errors.google_link}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Heath Grade Link</Label>
            <Input
              name="heathGrade_link"
              className="form-control"
              placeholder="https://www.healthgrades.com/"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.heathGrade_link || ''}
              invalid={
                validation.touched.heathGrade_link &&
                validation.errors.heathGrade_link
                  ? true
                  : false
              }
            />
            {validation.touched.heathGrade_link &&
            validation.errors.heathGrade_link ? (
              <FormFeedback type="invalid">
                {validation.errors.heathGrade_link}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Yelp Link</Label>
            <Input
              name="yelp_link"
              className="form-control"
              placeholder="https://www.healthgrades.com/"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.yelp_link || ''}
              invalid={
                validation.touched.yelp_link && validation.errors.yelp_link
                  ? true
                  : false
              }
            />
            {validation.touched.yelp_link && validation.errors.yelp_link ? (
              <FormFeedback type="invalid">
                {validation.errors.yelp_link}
              </FormFeedback>
            ) : null}
          </div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            onChange={onFileChanged}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>

          <div className="mt-3 d-grid">
            <button
              className="btn btn-block fw-bold text-white "
              type="submit"
              style={{ background: '#F6653F' }}
            >
              Create
            </button>
          </div>
        </Form>
      </Modal>
    </CustomeContainer>
  );
};

export default withRouter(UserDashboard);
