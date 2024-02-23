import React, { useEffect, useState } from 'react';

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
import { useUserAuth } from 'contexts/UserAuth';

// import images
import Profile from '../../assets/images/logo.png';
import backgroundImage from '../../assets/img/Docapt.png';
// import Video from '../../assets/images/docapt.mp4';

//import thunk
// import {
//   loginuser,
//   resetLoginMsgFlag,
//   socialLogin,
// } from 'slices/auth/login/thunk';
import { Img, Svg } from 'react-optimized-image';
import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { userLogin } from 'api/usersLogin';
import { profile } from 'console';
import { message } from 'antd';
import CustomePass from 'Components/CustomePass';

const UserLogin = (props: any) => {
  const { storeToken, isLoggedIn, avater, isNewUser } = useUserAuth();
  const nevigation = useNavigate();
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  const dispatch: any = useDispatch();



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
      temporary: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your email').trim(),
      password: Yup.string().required('Please Enter Your Password'),
      temporary: Yup.number().required('Please Enter Your Temporary Code'),
    }),
    onSubmit: (values: any) => {
      userLogin(values).then((resp: any) => {
        const res = resp.data;
        if (res.msg.name === 'error') {
          return message.error(res.msg.msg);
        }
        avater(`api/uploads/${res.avater}`, res.username);
        storeToken(res.token);
        isNewUser(res.isValid);
        return nevigation('/short-cut');
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

  if (isLoggedIn) {
    return <Navigate to="/user/short-cut" />;
  }

  return (
    <div>
      <Row
        className="d-flex align-items-center justify-content-center"
        style={{
          overflow: 'hidden',
          height: '100vh',
          width: '100%',
        }}
      >
        <Col sm={12} md={7} lg={6}>
          <Card className="rounded-5 d-block m-auto  card_width ">
            <CardBody className="py-5 px-4">
              <div>
                <div className="py-4">
                  <img
                    className="w-50 d-block m-auto"
                    src={Profile}
                    alt="logo"
                  />
                </div>
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
                  <CustomePass
                    className="rounded-start-pill"
                    buttonClassName="rounded-end-pill"
                    name="password"
                    handleBlur={validation.handleBlur}
                    handleChange={validation.handleChange}
                    placeholder="Enter your password"
                    touchedError={validation.touched.password}
                    validationError={validation.errors.password}
                    value={validation.values.password}
                  />

                  <div className="mb-3">
                    <Label className="form-label">Temporary Code</Label>
                    <div className="input-group auth-pass-inputgroup">
                      <Input
                        name="temporary"
                        className="rounded-start-pill "
                        value={validation.values.temporary || ''}
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Temporary Code"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.temporary &&
                          validation.errors.temporary
                            ? true
                            : false
                        }
                      />
                      <button
                        onClick={() => setShow(!show)}
                        className="btn btn-light rounded-end-pill "
                        style={{ background: '#FE9150' }}
                        type="button"
                        id="password-addon"
                      >
                        <i className="mdi mdi-eye-outline"></i>
                      </button>
                    </div>
                    {validation.touched.temporary &&
                    validation.errors.temporary ? (
                      <FormFeedback type="invalid">
                        {validation.errors.temporary}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <Link
                    className="fs-6 text-decoration-none text-black fw-semibold"
                    to="/user/forgot-password"
                  >
                    Forget Password
                  </Link>
                  <div className="mt-3 d-grid">
                    <button
                      className="btn btn-block fw-bold text-white fs-5 rounded-5"
                      type="submit"
                      style={{ background: '#FE9150' }}
                    >
                      Log In
                    </button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col className="d-none d-lg-block">
          <div>
            <img
              style={{ width: '100%', height: '100vh' }}
              src={backgroundImage}
              alt="logo"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(UserLogin);
