import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from 'reactstrap';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import profile from '../../assets/images/doc-apt.png';
// action
// import { registerUser, apiError } from '../../slices/thunk';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { Link, useNavigate, Navigate } from 'react-router-dom';
import { register } from '../../api/register';

// import images
import profileImg from '../../assets/images/profile-img.png';
import { createSelector } from 'reselect';
import { useAuth } from 'contexts/auth';
import { forEach } from 'lodash';
const Register = () => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const dispatch = useDispatch<any>();
  const { storeToken, token, isLoggedIn, isAdmin } = useAuth();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      username: Yup.string().required('Please Enter Your Username'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: values => {
      register(values).then((resp: any) => {
        const res = resp.data;
        if (res.msg.name === 'ZodError') {
          return setErrorMessage(res.msg.issues[0].message);
        }
        if (res.msg.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }

        if (!res.isAdmin) {
          return setAdminMessage(
            'Please wait for admin approval and got to login'
          );
        }
      });
    },
  });

  const selectProperties = createSelector(
    (state: any) => state.Account,
    account => ({
      user: account.user,
      registrationError: account.registrationError,
      loading: account.loading,
    })
  );

  const { user, registrationError } = useSelector(selectProperties);

  // useEffect(() => {
  //   dispatch(apiError());
  // }, [dispatch]);

  useEffect(() => {
    setInterval(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/super-admin/dashboard" />;
  }

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
                    <Alert
                      color="danger"
                      className={`${errorMessage ? 'd-block' : 'd-none'}`}
                    >
                      {errorMessage}
                    </Alert>
                    <Alert
                      color="success"
                      className={`${
                        adminMessage ? 'd-block' : 'd-none'
                      } fw-bold`}
                    >
                      {adminMessage}
                    </Alert>
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {user && user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}

                      {registrationError && registrationError ? (
                        <Alert color="danger">{registrationError}</Alert>
                      ) : null}
                      <img
                        className="d-block m-auto"
                        style={{
                          height: '50px',
                          width: '100px',
                          objectFit: 'contain',
                        }}
                        src={profile}
                        alt="Logo"
                      />

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
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ''}
                          invalid={
                            validation.touched.username &&
                            validation.errors.username
                              ? true
                              : false
                          }
                        />
                        {validation.touched.username &&
                        validation.errors.username ? (
                          <FormFeedback type="invalid">
                            {validation.errors.username}
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
                          Register
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
