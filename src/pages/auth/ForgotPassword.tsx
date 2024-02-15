import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from 'reactstrap';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import withRouter from 'Components/Common/withRouter';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

// import images
import logodark from '../../assets/images/logo-dark.png';
import logolight from '../../assets/images/logo-light.png';
// action
// import { userForgetPassword } from '../../slices/thunk';

// import images
import profile from '../../assets/images/logo.png';
import logo from '../../assets/images/logo.svg';
import { createSelector } from 'reselect';
import axios from 'axios';
import {
  FORGET_PASSWORD_USER,
  RESETPASSWORD_LINK,
} from '../../helpers/url_helper';
import { message } from 'antd';

const ForgetPasswordPage = props => {
  const [isSendMessage, setIsSendMessage] = useState(false);

  const dispatch = useDispatch<any>();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
    }),
    onSubmit: values => {
      const link = RESETPASSWORD_LINK;
      axios.get(FORGET_PASSWORD_USER, {
        headers: { ...values, link },
      }).then(res => {
        if (res.msg.name === 'error') {
          message.error(res.msg.msg)
         }        
        setIsSendMessage(true);
      });
    },
  });

  const selectProperties = createSelector(
    (state: any) => state.ForgetPassword,
    forgetPassword => ({
      forgetError: forgetPassword.forgetError,
      forgetSuccessMsg: forgetPassword.forgetSuccessMsg,
    })
  );

  const { forgetError, forgetSuccessMsg } = useSelector(selectProperties);

  return (
    <React.Fragment>
      {(!isSendMessage) ? (
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden rounded-4">
                  <div>
                    <Row>
                      <Col xs={7}>
                        <div className="text-black p-4">
                          <h5 className="text-black">Forget Passowrd!</h5>
                          <p>Sign in to continue to Docapt</p>
                        </div>
                      </Col>
                      {/* <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col> */}
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <img
                        src={profile}
                        alt=""
                        className="img-fluid w-50 d-block m-auto"
                      />
                    </div>
                    <div className="p-2">
                      {forgetError && forgetError ? (
                        <Alert color="danger" style={{ marginTop: '13px' }}>
                          {forgetError}
                        </Alert>
                      ) : null}
                      {forgetSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: '13px' }}>
                          {forgetSuccessMsg}
                        </Alert>
                      ) : null}

                      <Form
                        className="form-horizontal"
                        onSubmit={e => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <Row className="mb-3">
                          <Col className="text-end">
                            <button
                              style={{ background: '#F77857' }}
                              className="btn w-md fw-semibold text-white "
                              type="submit"
                            >
                              Reset
                            </button>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{' '}
                    <Link
                      to="/login"
                      className="font-weight-medium text-primary"
                    >
                      Login
                    </Link>{' '}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card>
                  <CardBody>
                    <div className="p-2">
                      <div className="text-center">
                        <div className="avatar-md mx-auto">
                          <div className="avatar-title rounded-circle bg-light">
                            <i className="bx bx-mail-send h1 mb-0 text-primary"></i>
                          </div>
                        </div>
                        <div className="p-2 mt-4">
                          <h4>Success !</h4>
                          <p className="text-muted">
                            We have successfully sent a password reset email to
                            the address associated with your account. Please
                            check your email inbox for further instructions on
                            how to reset your password.
                          </p>
                          <div className="mt-4">
                            <Link
                              to="/login"
                              className="btn fw-semibold text-white"
                              style={{ background: '#F77857' }}
                            >
                              Back to Home
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{' '}
                    <Link
                      to="/login"
                      className="font-weight-medium text-primary"
                    >
                      Login
                    </Link>{' '}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default withRouter(ForgetPasswordPage);
