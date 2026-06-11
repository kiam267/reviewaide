import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from 'reactstrap';
import { Link } from 'react-router-dom';
// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingOutlined } from '@ant-design/icons';
import { useResetPassword } from 'api/userApi';
import { Spin } from 'antd';
function ResetPassword() {
  const { id, token } = useParams();
  const { userResetPassword, isPending } = useResetPassword();
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
      userResetPassword({ ...values, id, token });
    },
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
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
                  {/* <img
                    src={profile}
                    alt=""
                    className="img-fluid w-50 d-block m-auto"
                  /> */}

                  <h1 className="text-gradients">Review Aide</h1>
                </div>
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
                            <>Conform Password</>
                          )}
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
                <Link to="/" className="font-weight-medium text-primary">
                  Login
                </Link>{' '}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ResetPassword;
