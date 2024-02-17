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
  //meta title
  document.title = 'Register | Admin';
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
    return <Navigate to="/auth/dashboard" />;
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
          <Card className="overflow-hidden py-lg-5">
            <Row className="justify-content-center">
              <Col lg={6} xl={5} className="d-none d-lg-block">
                <img src={profileImg} alt="" className="img-fluid" />
              </Col>
              <Col md={8} lg={6} xl={5}>
                <div className="bg-primary-subtle">
                  <Row className="d-lg-none">
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Free Register</h5>
                        <p>Get your free Skote account now.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
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
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center pt-2 fs-5">
                        Already have an account ?{' '}
                        <Link to="/auth/login" className="fw-bold text-primary">
                          {' '}
                          Login{' '}
                        </Link>{' '}
                      </p>
                    </Form>
                  </div>
                </CardBody>

                <div className="mt-5 text-center">
                  <p>
                    © {new Date().getFullYear()} Skote. Crafted with{' '}
                    <i className="mdi mdi-heart text-danger" /> by Themesbrand
                  </p>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
