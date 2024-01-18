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

//import thunk
import { resetLoginMsgFlag } from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { login } from 'api/login';
import { useUserAuth } from 'contexts/UserAuth';
import { userUpdate } from 'api/userUpdate';

const UpdateProfile = (props: any) => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const { storeToken } = useUserAuth();
  const dispatch: any = useDispatch();

  const navigation = useNavigate();
  //meta title
  document.title = 'Update  | Docapt - User';

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
      userUpdate(values).then(res => {
        if (res.msg.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }
        if (res.msg.name === 'ZodError') {
          return setErrorMessage(res.msg.issues[0].message);
        }
        storeToken(res.token);
        setAdminMessage(res.msg.msg);
        return;
      });
    },
  });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetLoginMsgFlag());
      }, 3000);
    }
  }, [dispatch, error]);

  useEffect(() => {
    setInterval(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  return (
    <React.Fragment>
      <div className="account-pages  pt-sm-5 mt-3 mt-lg-0">
        <Container>
          <Row className="justify-content-center  py-lg-5">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden py-lg-5  ">
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
                        {error ? <Alert color="danger">{error}</Alert> : null}
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
                          Update Profile
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
              © {2024} Docapt. Crafted with{' '}
              <i className="mdi mdi-heart text-danger" /> by Copmpany
            </p>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UpdateProfile);
