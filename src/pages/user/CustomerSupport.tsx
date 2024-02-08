import AllContainer from 'Components/Common/CustomeContainer';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { CUSSTOMER_SUPPORT_EMAIL } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';
import { message } from 'antd';

function CustomerSupport(props) {
  const [validCookie, setValidCookie] = useState(false);
  const nestedformik: any = useFormik({
    initialValues: {
      email: '',
      msg: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email()
        .matches(/^(?!.*@[^,]*,)/)
        .required('Please Enter Your Email'),
      msg: Yup.string().required('This field is required'),
    }),

    onSubmit: (value: any, { resetForm }) => {
      const token = localStorage.getItem('UserToken');
      axios
        .post(CUSSTOMER_SUPPORT_EMAIL, { ...value }, { headers: { token } })
        .then(res => {
          if (res?.msg?.name === 'error') {
            message.error(res.msg.msg);
            return;
          }
          if (res?.msg?.name === 'success') {
            message.success(res.msg.msg);
            resetForm();
            return;
          }

          if (res.msg.name === 'auth') {
            return setValidCookie(true);
          }
        });

      // console.log("value", values.password);
    },
  });

  if (validCookie) {
    return <Logout />;
  }
  return (
    <AllContainer>
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <CardBody>
              <h6 className="mb-4 card-title">Customer Support</h6>
              <p>
                Currently, only email support is available. However, very soon
                we will be launching a live chat feature. Please stay tuned!
              </p>
              <Form
                className="outer-repeater"
                onSubmit={nestedformik.handleSubmit}
              >
                <div data-repeater-list="outer-group" className="outer">
                  <div data-repeater-item className="outer">
                    <div className="mb-3">
                      <Label htmlFor="formemail">Email :</Label>
                      <Input
                        type="email"
                        id="formemail"
                        name="email"
                        placeholder="Enter your Email..."
                        className="form-control"
                        value={nestedformik.values.email}
                        onChange={nestedformik.handleChange}
                        onBlur={nestedformik.handleBlur}
                        invalid={
                          nestedformik.touched.email &&
                          nestedformik.errors.email
                            ? true
                            : false
                        }
                      />
                      {nestedformik.errors.email &&
                      nestedformik.touched.email ? (
                        <FormFeedback type="invalid">
                          {nestedformik.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="formmessage">Message :</Label>
                      <Input
                        type="textarea"
                        id="formmessage"
                        name="msg"
                        className="form-control"
                        rows="3"
                        placeholder="Enter your Message"
                        value={nestedformik.values.msg}
                        onChange={nestedformik.handleChange}
                        onBlur={nestedformik.handleBlur}
                        invalid={
                          nestedformik.touched.msg && nestedformik.errors.msg
                            ? true
                            : false
                        }
                      />
                      {nestedformik.errors.msg && nestedformik.touched.msg ? (
                        <FormFeedback type="invalid">
                          {nestedformik.errors.msg}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <Button
                      type="submit"
                      color="fw-semibold text-white"
                      style={{ background: '#F77857' }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </AllContainer>
  );
}

export default CustomerSupport;
