import React, { useEffect, useState } from 'react';

import { Link, useNavigate, Navigate, useNavigation } from 'react-router-dom';
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
// import {
//   loginuser,
//   resetLoginMsgFlag,
//   socialLogin,
// } from 'slices/auth/login/thunk';
// Formik validation
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { createSelector } from 'reselect';
import { createUsres } from 'api/createUsers';
import { useAuth } from 'contexts/auth';
import Logout from 'pages/auth/Logout';
import AdminLogout from 'pages/auth/AdminLogout';
import axios from 'axios';
import { CREATE_USERS } from '../../helpers/url_helper';
import dateFormat from 'dateformat';
function CreateUsers(props) {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [validCookie, setValidCookie] = useState(true);
  const dispatch: any = useDispatch();
  //meta title
  document.title = 'Create users | Docapt -  Admin & Dashboard ';
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  useEffect(() => {
    setInterval(() => {
      setErrorMessage('');
      setAdminMessage('');
    }, 3000);
  }, [errorMessage, adminMessage]);
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
    onSubmit: (values: any, { resetForm }) => {
      const token = localStorage.getItem('adToken');
      const now = new Date();
      const date = dateFormat(now, 'dddd, mmmm dS, yyyy');
      const data = { ...values, date };
      axios
        .post(CREATE_USERS, data, { headers: { token } })
        .then((resp: any) => {
          const res = resp.data;
          if (res?.msg?.name === 'error') {
            return setErrorMessage(res?.msg?.msg);
          }

          if (res?.msg?.name === 'success') {
            setAdminMessage(res?.msg?.msg);
            return resetForm();
          }
          if (res.msg.name === 'auth') {
            setValidCookie(false);
          }
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

  if (!validCookie) {
    return <AdminLogout />;
  }
  return (
    <React.Fragment>
      <div className="account-pages  pt-sm-5 mt-3 mt-lg-0">
        <Container>
          <Row className="justify-content-center  py-lg-5">
            <Col md={8} lg={6} xl={5}>
              <Card>
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
                        {/* {error ? <Alert color="danger">{error}</Alert> : null} */}
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
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
                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Create A Users
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <div className="mt-5 text-center">
            <p>
              © 2024 Docapt. Crafted with{' '}
              <i className="mdi mdi-heart text-danger" /> by Copmpany
            </p>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default CreateUsers;
