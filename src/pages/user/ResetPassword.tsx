import { useNavigate, useParams, Navigate } from 'react-router-dom';
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
  POST_RESET_PASSWORD_USER,
  RESETPASSWORD_LINK,
  RESET_PASSWORD_USER,
} from '../../helpers/url_helper';
import { message } from 'antd';
import CustomePass from 'Components/CustomePass';
function ResetPassword() {
  const { id, token } = useParams();
  const [isSendMessage, setIsSendMessage] = useState(false);
  const dispatch = useDispatch<any>();
  const [show, setShow] = useState(false);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Please Enter Your Paaword'),
    }),
    onSubmit: values => {
      axios.post(POST_RESET_PASSWORD_USER, { ...values, id }).then(re => {
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

  useEffect(() => {
    passToken();
  }, []);

  const passToken = () => {
    const config = {
      token: token,
      id: id,
    };
    axios
      .get(RESET_PASSWORD_USER, {
        headers: config,
      })
      .then(resp => {
        const res = resp.data;
        if (res.msg.name === 'error') {
          message.error(res.msg.msg);
          setIsSendMessage(true);
          return;
        }
        return setIsSendMessage(true);
      })
      .catch(error => console.log(error));
  };
  const { forgetError, forgetSuccessMsg } = useSelector(selectProperties);
  console.log(isSendMessage);

  console.log(validation.errors.password);

  if (isSendMessage) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="account-pages my-5 pt-sm-5">
      {!isSendMessage ? (
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden rounded-4">
                <div>
                  <Row>
                    <Col xs={7}>
                      <div className="text-black p-4">
                        <h5 className="text-black">Reset Passowrd!</h5>
                      </div>
                    </Col>
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
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            type={show ? 'text' : 'password'}
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
                        </div>
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
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
                            Conform Password
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
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>{' '}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <p>Email Invalid</p>
      )}
    </div>
  );
}

export default ResetPassword;
