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
import profile from '../../assets/images/profile-img.png';

//import thunk
import {
  loginuser,
  resetLoginMsgFlag,
  socialLogin,
} from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { userLogin } from 'api/usersLogin';

const UserLogin = (props: any) => {
  const { storeToken, isLoggedIn } = useUserAuth();
  const nevigation = useNavigate();
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  const dispatch: any = useDispatch();

  //meta title
  document.title = 'User | Docapt - React Admin & Dashboard Template';

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
      userLogin(values).then((res: any) => {
        if (res.msg.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }
        console.log(res);
        
        storeToken(res.token);
        return nevigation('/user');
      });
    },
  });

  const signIn = (type: any) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetLoginMsgFlag());
      }, 3000);
    }
  }, [dispatch, error]);

  if (isLoggedIn) {
  return <Navigate to='/user'/>
}
  return (
    <React.Fragment>
      <div className="account-pages  pt-sm-5 mt-3 mt-lg-0">
        <Container>
          <Card className="overflow-hidden py-lg-5 ">
            <Row className="justify-content-center  py-lg-5">
              <Col lg={6} xl={5} className="d-none d-lg-block">
                <img src={profile} alt="" className="img-fluid" />
              </Col>
              <Col md={8} lg={6} xl={5}>
                <div className="bg-primary-subtle">
                  <Row className="d-block d-lg-none">
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Skote.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
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
                          Log In
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Col>
            </Row>
          </Card>
          <div className="mt-5 text-center">
            <p>
              © {new Date().getFullYear()} Skote. Crafted with{' '}
              <i className="mdi mdi-heart text-danger" /> by Copmpany
            </p>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserLogin);
