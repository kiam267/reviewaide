import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
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
import { resetLoginMsgFlag, socialLogin } from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { clientVisitor } from 'api/clientVisitor';
import AllContainer from 'Components/Common/Container';

const UserDashboard = (props: any) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  interface SENDMETHOD {
    email: boolean;
    sms: boolean;
    both: boolean;
  }
  const [sendMethod, setSendMethods] = useState<SENDMETHOD>({
    email: false,
    sms: false,
    both: false,
  });

  const now = new Date();
  useEffect(() => {
    setDate(dateFormat(now, 'dddd, mmmm dS, yyyy'));
    setTimeout(() => {
      setErrorMessage(null);
      setAdminMessage(null);
    }, 3000);
  }, []);

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
      username: '',
      email: '',
      phone: '',
      date: date,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your Patient Name '),
      email: Yup.string().email().required('Please Enter Your Patient Email'),
      phone: Yup.number().required('Please Enter Your Patient Number'),
      date: Yup.string().required(
        'Please Enter Your Patient Date'
      ),
    }),
    onSubmit: (values: any) => {
      clientVisitor(values, sendMethod).then(res => {
        if (res.msg.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }
        return setAdminMessage(res.msg.msg);
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

  return (
    <React.Fragment>
      <AllContainer>
        <div className="account-pages  pt-sm-5 mt-lg-0">
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
                          <Label className="form-label">Name</Label>
                          <Input
                            name="username"
                            className="form-control"
                            placeholder="Enter Your Patient Name"
                            type="text"
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
                          {error ? <Alert color="danger">{error}</Alert> : null}
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter Your Patient Email"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          {error ? <Alert color="danger">{error}</Alert> : null}
                          <Label className="form-label">Phone</Label>
                          <Input
                            name="phone"
                            className="form-control"
                            placeholder="Enter Your Patient Phone Number"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ''}
                            invalid={
                              validation.touched.phone &&
                              validation.errors.phone
                                ? true
                                : false
                            }
                          />
                          {validation.touched.phone &&
                          validation.errors.phone ? (
                            <FormFeedback type="invalid">
                              {validation.errors.phone}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          {error ? <Alert color="danger">{error}</Alert> : null}
                          <Label className="form-label">Date</Label>
                          <Input
                            name="date"
                            className="form-control"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.date || ''}
                            invalid={
                              validation.touched.date && validation.errors.date
                                ? true
                                : false
                            }
                          />
                          {validation.touched.date && validation.errors.date ? (
                            <FormFeedback type="invalid">
                              {validation.errors.date}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div>
                          <div className="form-check form-check-primary mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="email"
                              checked={sendMethod.email}
                              required
                              onChange={() => {
                                setSendMethods((prev: SENDMETHOD) => ({
                                  ...prev,
                                  email: !prev.email,
                                }));
                              }}
                            />

                            <label className="form-check-label" htmlFor="email">
                              Email
                            </label>
                          </div>
                          <div className="form-check form-check-primary mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="sms"
                              checked={sendMethod.sms}
                              required
                              onChange={() => {
                                setSendMethods((prev: SENDMETHOD) => ({
                                  ...prev,
                                  sms: !prev.sms,
                                }));
                              }}
                            />

                            <label className="form-check-label" htmlFor="sms">
                              SMS
                            </label>
                          </div>
                          <div className="form-check form-check-primary mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="both"
                              checked={sendMethod.both}
                              onChange={() => {
                                setSendMethods((prev: SENDMETHOD) => ({
                                  ...prev,
                                  both: !prev.both,
                                }));
                              }}
                            />

                            <label className="form-check-label" htmlFor="both">
                              Both
                            </label>
                          </div>
                        </div>

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block "
                            type="submit"
                          >
                            Create a schedule
                          </button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </AllContainer>
    </React.Fragment>
  );
};

export default withRouter(UserDashboard);
