import CustomeContainer from 'Components/Common/CustomeContainer';
import { Card, Empty, Select, message } from 'antd';
import React, { useState } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Alert, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import axios from 'axios';
import { USER_MARKETING_STORE, LINK } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';
function Marketing() {
  const [method, setMethod] = useState<string>();
  const [validCookie, setValidCookie] = useState(false);
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);
  const handleChange = (value: string) => {
    setMethod(value);
  };

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: '',
      email: '',
      phone: '+1',
      message: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your  Name.'),
      email: Yup.string().email().required('Please Enter Your Email.').trim(),
      phone: Yup.number().required('Please Enter Your  Number.'),
      message: Yup.string().required('Please Enter Your Message.'),
    }),
    onSubmit: (values: any, { resetForm }) => {
      const token = localStorage.getItem('UserToken');
      axios
        .post(
          USER_MARKETING_STORE,
          { ...values, token, method, LINK },
          { headers: { token } }
        )
        .then(resp => {
          const res = resp.data;
          if (res?.msg?.name === 'error') {
            message.error(res.msg.msg);
            return;
          }
          if (res?.msg?.name === 'success') {
            message.success(res.msg.msg);
            resetForm();
            return;
          }

          if (res.msg.name === 'auth') {
            return setValidCookie(true);
          }
        });
    },
  });

  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Row className="justify-content-center">
        <Col sm={12} lg={6}>
          <Card className="my-4">
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
                <Label className="form-label">Select Methods</Label>
                <Select
                  defaultValue="Email"
                  className="d-block"
                  style={{ height: '40px' }}
                  onChange={handleChange}
                  options={[
                    { value: 'sms', label: 'SMS' },
                    { value: 'email', label: 'Email' },
                    { value: 'both', label: 'Both' },
                  ]}
                />
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
                <Label className="form-label">Enter Your Email or SMS</Label>
                <Input
                  type="textarea"
                  id="formmessage"
                  name="message"
                  className="form-control"
                  rows="6"
                  placeholder="Enter your Message"
                  value={validation.values.message}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.message && validation.errors.message
                      ? true
                      : false
                  }
                />
                {validation.touched.message && validation.errors.message ? (
                  <FormFeedback type="invalid">
                    {validation.errors.message}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mt-3 d-grid">
                <button
                  className="btn btn-block fw-bold text-white "
                  type="submit"
                  style={{ background: '#F6653F' }}
                >
                  send message
                </button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </CustomeContainer>
  );
}

export default Marketing;
