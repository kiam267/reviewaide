import React, { useEffect, useState } from 'react';

// Redux
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
} from 'reactstrap';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';

import { useAdminLogin } from 'api/adminApi';
import { Spin } from 'antd';
import { useAuth } from 'contexts/auth';

const Login = (props: any) => {
  const [show, setShow] = useState(false);
  const { isLoggedIn } = useAuth();

  const { adminLogin, isPending } = useAdminLogin();
  const navigation = useNavigate();
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
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your email'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: async (values: any) => {
      await adminLogin(values);
    },
  });

  if (isLoggedIn) {
    return <Navigate to="/super-admin/allUsers" />;
  }
  return (
    <React.Fragment>
      <div className=" pt-sm-5 mt-3 mt-lg-0">
        <Container>
          <Row
            className="justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
          >
            <Col md={12} lg={6} xl={5}>
              <Card className="py-lg-5 rounded-5">
                <CardBody className="pt-0">
                  <h1 className="fw-bold text-black  text-center p-3">
                    REVIEW <span className="text-gradients">AIDE</span>
                  </h1>
                  <div className="p-2">
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
                        <Label className="form-label">Email</Label>
                        <Input
                          cl
                          name="email"
                          className="form-control rounded-4"
                          placeholder="Enter email"
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
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            className="rounded-start-pill"
                            name="password"
                            value={validation.values.password || ''}
                            type={show ? 'text' : 'password'}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <button
                            onClick={() => setShow(!show)}
                            className="btn btn-light rounded-end-pill "
                            type="button"
                            id="password-addon"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                        </div>
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mt-3 d-grid">
                        <button
                          style={{ background: '#F6653F' }}
                          className="btn btn-block rounded-5 w-75 m-auto text-white fw-semibold "
                          type="submit"
                        >
                          {isPending ? (
                            <Spin
                              style={{
                                color: '#FFFFFF',
                              }}
                              indicator={
                                <LoadingOutlined
                                  style={{ fontSize: 24 }}
                                  spin
                                />
                              }
                            />
                          ) : (
                            <>Log In</>
                          )}
                        </button>
                      </div>
                      {/* <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div> */}
                    </Form>
                  </div>
                  <p className="text-center pt-2 fs-5">
                    Don&apos;t have an account ?{' '}
                    <Link
                      to="/super-admin/register"
                      className="fw-bold "
                      style={{ color: '#F6653F' }}
                    >
                      {' '}
                      Signup now{' '}
                    </Link>{' '}
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);
