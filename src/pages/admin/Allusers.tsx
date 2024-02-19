import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Skeleton,
  Avatar,
  message,
  Drawer,
  Button,
} from 'antd';
import axios from 'axios';
import AdminLogout from 'pages/auth/AdminLogout';
import { GET_USERS, SERVER_LINK } from '../../helpers/url_helper';
import CustomeContainer from 'Components/Common/CustomeContainer';
import user from 'Layouts/user';
import { Alert, Form, FormFeedback, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
const { Meta } = Card;

function Allusers(props) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([
    {
      company_name: '',
      date: '',
      email: '',
      facebook_link: '',
      google_link: '',
      phato_path: '',
      phone: '',
      temporaray_lock: '',
      uniqueId: '',
      username: '',
    },
  ]);
  const [Sglusers, setSglUsers] = useState<UserData>({
    company_name: '',
    date: '',
    email: '',
    facebook_link: '',
    google_link: '',
    phato_path: '',
    phone: '',
    temporaray_lock: '',
    uniqueId: '',
    username: '',
  });
  const [validCookie, setValidCookie] = useState(true);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const token = localStorage.getItem('adToken');
    axios.get(GET_USERS, { headers: { token } }).then(resp => {
      const res = resp.data;
      if (res?.msg?.name === 'error') {
        return message.error(res?.msg?.msg);
      }

      if (res?.msg?.name === 'success') {
        setUsers(res.msg[0]);
        return;
      }
      if (res.msg.name === 'auth') {
        setValidCookie(false);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const onHadelEdit = id => {
    const singleUser = users.filter(user => (user.uniqueId === id ? user : ''));
    setSglUsers(singleUser[0]);
    return;
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
      username: Sglusers.username,
      email: Sglusers.email,
      phone: Sglusers.phone,
      date: Sglusers.date,
      company_name: Sglusers.company_name,
      facebook_link: Sglusers.facebook_link,
      google_link: Sglusers.google_link,
      temporaray_lock: Sglusers.temporaray_lock,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your Patient Name'),
      email: Yup.string()
        .email()
        .required('Please Enter Your Patient Email')
        .trim(),
      phone: Yup.number().required('Please Enter Your Patient Number'),
      date: Yup.string().required('Please Enter Your Patient Date'),
      company_name: Yup.string().required('Please Enter Company Name'),
      facebook_link: Yup.string().required('Please Enter Facebook Link'),
      google_link: Yup.string().required('Please Enter Google Link'),
      temporaray_lock: Yup.string().required('Please Enter Temporary Lock'),
    }),
    onSubmit: (values: any, { resetForm }) => {},
  });
  if (!validCookie) {
    return <AdminLogout />;
  }

  return (
    <CustomeContainer>
      <Row gutter={[100, 24]} className="p-5">
        {users.map((user, inx) => (
          <Col sm={24} lg={12} key={inx}>
            <Card
              className="p-4 rounded-4"
              actions={[
                <Button type="primary" onClick={showDrawer}>
                  <i
                    className="bx bxs-edit-alt"
                    onClick={() => onHadelEdit(user.uniqueId)}
                  ></i>
                  ,
                </Button>,
                <i className="bx bxs-trash-alt"></i>,
              ]}
            >
              <Skeleton loading={loading} avatar>
                <div className="d-flex justify-content-center align-items-center gap-4">
                  <div>
                    <img
                      style={{
                        objectFit: 'contain',
                        height: '100px',
                        width: '100px',
                      }}
                      src={`${SERVER_LINK}api/uploads/${user.phato_path}`}
                      alt=""
                    />
                  </div>
                  <div className="pt-3 d-flex justify-content-center align-items-center">
                    <div className="d-block">
                      <h4 className="fs-5 text-capitalize">{user.username}</h4>
                      <h4 className="fs-6">{user.email}</h4>
                      <p className="text-body-tertiary">{user.date}</p>
                    </div>
                  </div>
                </div>
              </Skeleton>
            </Card>
          </Col>
        ))}
        <Drawer className="py-5" onClose={onClose} open={open}>
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
                  validation.touched.date && validation.errors.date
                    ? true
                    : false
                }
              />
              {validation.touched.date && validation.errors.date ? (
                <FormFeedback type="invalid">
                  {validation.errors.date}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              {error ? <Alert color="danger">{error}</Alert> : null}
              <Label className="form-label">Company Name</Label>
              <Input
                name="company_name"
                className="form-control"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.company_name || ''}
                invalid={
                  validation.touched.company_name &&
                  validation.errors.company_name
                    ? true
                    : false
                }
              />
              {validation.touched.company_name &&
              validation.errors.company_name ? (
                <FormFeedback type="invalid">
                  {validation.errors.company_name}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              {error ? <Alert color="danger">{error}</Alert> : null}
              <Label className="form-label">Facebook Link</Label>
              <Input
                name="facebook_link"
                className="form-control"
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
              <Label className="form-label">google Link</Label>
              <Input
                name="google_link"
                className="form-control"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.google_link || ''}
                invalid={
                  validation.touched.google_link &&
                  validation.errors.google_link
                    ? true
                    : false
                }
              />
              {validation.touched.google_link &&
              validation.errors.google_link ? (
                <FormFeedback type="invalid">
                  {validation.errors.google_link}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              {error ? <Alert color="danger">{error}</Alert> : null}
              <Label className="form-label">Temporaray Lock</Label>
              <Input
                name="temporaray_lock"
                className="form-control"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.temporaray_lock || ''}
                invalid={
                  validation.touched.temporaray_lock &&
                  validation.errors.temporaray_lock
                    ? true
                    : false
                }
              />
              {validation.touched.temporaray_lock &&
              validation.errors.temporaray_lock ? (
                <FormFeedback type="invalid">
                  {validation.errors.temporaray_lock}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mt-3 d-grid">
              <button
                className="btn btn-block fw-bold text-white "
                type="submit"
                style={{ background: '#F6653F' }}
              >
                Update
              </button>
            </div>
          </Form>
        </Drawer>
      </Row>
    </CustomeContainer>
  );
}

export default Allusers;
