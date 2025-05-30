import React from 'react';
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
import withRouter from 'Components/Common/withRouter';
// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingOutlined } from '@ant-design/icons';
import { RESETPASSWORD_LINK } from '../../helpers/url_helper';
import { Spin, message } from 'antd';
import { useForgetPassword } from 'api/userApi';

const ForgetPasswordPage = props => {
  const { userForgetPassword, isPending } = useForgetPassword();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      link: RESETPASSWORD_LINK,
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
    }),
    onSubmit: values => {
      userForgetPassword(values);
    },
  });





  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden rounded-4">
                <div>
                  <Row>
                    <Col xs={7}>
                      <div className="text-black p-4">
                        <h5 className="text-black">Forget Passowrd!</h5>
                        <p>Sign in to continue to Docapt</p>
                      </div>
                    </Col>
                    {/* <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col> */}
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    {/* <img
                        src={profile}
                        alt=""
                        className="img-fluid w-50 d-block m-auto"
                      /> */}
                    <h1 className="text-gradients text-center font-bold">
                      Review Aide
                    </h1>
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
                        <Label className="form-label">Email</Label>
                        <Input
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
                              <>Reset</>
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
    </React.Fragment>
  );
};

export default withRouter(ForgetPasswordPage);
