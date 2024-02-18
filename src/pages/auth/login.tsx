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

// import images
import profile from '../../assets/images/doc-apt.png';
import logo from '../../assets/bg.jpg';
import lightlogo from '../../assets/images/logo-light.svg';

//import thunk
// import {
//   loginuser,
//   resetLoginMsgFlag,
//   socialLogin,
// } from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { login } from 'api/login';
import { useAuth } from 'contexts/auth';
import { url } from 'inspector';

const Login = (props: any) => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const dispatch: any = useDispatch();
  const { storeToken, isLoggedIn } = useAuth();
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
    onSubmit: (values: any) => {
      login(values).then((resp: any) => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }
        if (!res?.isAdmin) {
          return setAdminMessage(
            'Please wait for admin approval and got to login'
          );
        }
        storeToken(res.token, res.isAdmin);
        navigation('/auth/dashboard');
      });
    },
  });

  // useEffect(() => {
  //   if (error) {
  //     setTimeout(() => {
  //       dispatch(resetLoginMsgFlag());
  //     }, 3000);
  //   }
  // }, [dispatch, error]);

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
      <div className=" pt-sm-5 mt-3 mt-lg-0">
        <Container>
          <Row className="justify-content-center">
            <Col md={12} lg={6} xl={5}>
              <Card className="py-lg-5 rounded-5">
                <CardBody className="pt-0">
                  <Alert
                    color="danger"
                    className={`${errorMessage ? 'd-block' : 'd-none'} mt-3`}
                  >
                    {errorMessage}
                  </Alert>
                  <Alert
                    color="success"
                    className={`${
                      adminMessage ? 'd-block' : 'd-none'
                    } fw-bold mt-3`}
                  >
                    {adminMessage}
                  </Alert>
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
                          Log In
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                  <p className="text-center pt-2 fs-5">
                    Don&apos;t have an account ?{' '}
                    <Link
                      to="/auth/register"
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
