import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormFeedback,
  Input,
  Label,
  Alert,
  Row,
  Col,
} from 'reactstrap';
import { Avatar, Badge, Button, Card, message } from 'antd';
//i18n
import { withTranslation } from 'react-i18next';
// Redux
import { Link } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import { createSelector } from 'reselect';

// users
import user1 from '../../../assets/images/users/avatar-1.jpg';

import { useSelector } from 'react-redux';
import { log } from 'console';
import axios from 'axios';
import CustomeContainer from 'Components/Common/CustomeContainer';
import {
  GET_USERS_DASHBOARD,
  GET_USERS_MINI_UPDATE,
} from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';
import * as Yup from 'yup';
import { useFormik } from 'formik';
const UpdateProfile = (props: any) => {
  // Declare a new state variable, which we'll call "menu"
  // const { avater } = useUserAuth();

  const [menu, setMenu] = useState(true);
  const [alldata, setAllData] = useState([
    {
      username: '',
      phone: '',
      company_name: '',
      facebook_link: '',
      google_link: '',
    },
  ]);
  const [validCookie, setValidCookie] = useState(false);
  const selectProfileProperties = createSelector(
    (state: any) => state.Avater,
    profile => ({
      name: profile.name,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios.get(GET_USERS_MINI_UPDATE, { headers: { token } }).then(res => {
      console.log(res);

      if (res?.msg?.name === 'error') {
        message.error('error', res.msg.msg);
      }
      if (res?.msg?.name === 'success') {
        setAllData(res.msg[0].data);
        return;
      }
      if (res.msg.name === 'auth') {
        return setValidCookie(true);
      }
    });
  }, []);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: alldata[0].username,
      phone: alldata[0].phone,
      companyName: alldata[0].company_name,
      google: alldata[0].google_link,
      facebook: alldata[0].facebook_link,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your Username'),
      phone: Yup.number().required('Please Enter Your email'),
      companyName: Yup.string().required('Please Enter Your Company Name'),
      google: Yup.string().required('Please Enter Your google Link'),
      facebook: Yup.string().required('Please Enter Your Facebook Link'),
    }),
    onSubmit: async (values: any, { setValues }) => {
      const token = localStorage.getItem('UserToken');
      axios
        .put(GET_USERS_DASHBOARD, { ...values }, { headers: { token } })
        .then(res => {
          console.log('ok...');

          if (res?.msg?.name === 'error') {
            message.error('error', res.msg.msg);
            return;
          }
          if (res?.msg?.name === 'success') {
            message.success('success', res.msg.msg);
            return;
          }
          if (res.msg.name === 'auth') {
            return setValidCookie(true);
          }
        });
    },
  });
  const { name } = useSelector(selectProfileProperties);

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  const { error } = useSelector(selectProperties);
  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Row className="justify-content-center">
        <Col sm={12} lg={6}>
          <Card>
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
                <Label className="form-label">username</Label>
                <Input
                  name="username"
                  className="form-control"
                  placeholder="Enter username"
                  type="text"
                  disabled={menu}
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
                <Label className="form-label">phone</Label>
                <Input
                  name="phone"
                  className="form-control"
                  placeholder="Enter a phone"
                  disabled={menu}
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
                <Label className="form-label">companyName</Label>
                <Input
                  name="companyName"
                  className="form-control"
                  disabled={menu}
                  placeholder="Enter a companyName"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.companyName || ''}
                  invalid={
                    validation.touched.companyName &&
                    validation.errors.companyName
                      ? true
                      : false
                  }
                />
                {validation.touched.companyName &&
                validation.errors.companyName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.companyName}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label">google</Label>
                <Input
                  name="google"
                  disabled={menu}
                  className="form-control"
                  placeholder="Enter  a google"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.google || ''}
                  invalid={
                    validation.touched.google && validation.errors.google
                      ? true
                      : false
                  }
                />
                {validation.touched.google && validation.errors.google ? (
                  <FormFeedback type="invalid">
                    {validation.errors.google}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label">facebook</Label>
                <Input
                  name="facebook"
                  disabled={menu}
                  className="form-control"
                  placeholder="Enter facebook"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.facebook || ''}
                  invalid={
                    validation.touched.facebook && validation.errors.facebook
                      ? true
                      : false
                  }
                />
                {validation.touched.facebook && validation.errors.facebook ? (
                  <FormFeedback type="invalid">
                    {validation.errors.facebook}
                  </FormFeedback>
                ) : null}
              </div>

              <div className="mt-3 d-grid">
                {menu ? (
                  <div
                    className="btn btn-block fw-bold text-white fs-5"
                    style={{ background: '#FE9150' }}
                    onClick={() => setMenu(false)}
                  >
                    Edit
                  </div>
                ) : (
                  <button
                    className="btn btn-block fw-bold text-white fs-5"
                    type="submit"
                    style={{ background: '#FE9150' }}
                  >
                    Update
                  </button>
                )}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </CustomeContainer>
  );
};

export default withRouter(withTranslation()(UpdateProfile));
