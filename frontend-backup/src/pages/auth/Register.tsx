import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from 'reactstrap';
import { LoadingOutlined } from '@ant-design/icons';
// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useAuth } from 'contexts/auth';
import { useCreateAdmin } from 'api/adminApi';
import { Spin } from 'antd';
const Register = () => {
  const [show, setShow] = useState(false);
  const { userSignUp, isPending } = useCreateAdmin();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      fullName: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      fullName: Yup.string().required('Please Enter Your fullName'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: async values => {
      await userSignUp(values);
    },
  });

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row
            className="justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
          >
            <Col md={12} lg={6} xl={5}>
              <Card className="py-lg-5 rounded-5">
                <CardBody className="pt-0">
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <h1 className="fw-bold text-black">
                        REVIEW <span className="text-gradients">AIDE</span>
                      </h1>

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
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
                        <Label className="form-label">fullName</Label>
                        <Input
                          name="fullName"
                          type="text"
                          placeholder="Enter fullName"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.fullName || ''}
                          invalid={
                            validation.touched.fullName &&
                            validation.errors.fullName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.fullName &&
                        validation.errors.fullName ? (
                          <FormFeedback type="invalid">
                            {validation.errors.fullName}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            type={show ? 'text' : 'password'}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ''}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <button
                            onClick={() => setShow(!show)}
                            className="btn btn-light "
                            type="button"
                            id="password-addon"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 d-grid">
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
                            <>Sign up</>
                          )}
                        </button>
                      </div>

                      <p className="text-center pt-2 fs-5">
                        Already have an account ?{' '}
                        <Link
                          to="/super-admin/login"
                          className="fw-bold "
                          style={{ color: '#F6653F' }}
                        >
                          {' '}
                          Login{' '}
                        </Link>{' '}
                      </p>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
