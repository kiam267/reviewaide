import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LoadingOutlined } from '@ant-design/icons';

// import * from ''
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Label,
  Input,
  Form,
  FormFeedback,
  Alert,
} from 'reactstrap';
import { Rating } from 'react-simple-star-rating';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useParams, Link } from 'react-router-dom';
import { Button, Spin } from 'antd';
import boopSfx from '../../assets/sounds/mixkit-message-pop-alert-2354.mp3';

import { REACT_APP_SERVER_API } from '../../helpers/url_helper';
import { useCreateClient, useReviewLogo } from 'api/clientApi';
const ShortcutReview = () => {
  //meta title
  const { id } = useParams();
  const { createClient, isPending } = useCreateClient();
  const { getReviewLogoInfo } = useReviewLogo({ uniqueId: String(id) });
  const [textareabadge, settextareabadge] = useState(0) as any[];
  const [textcount, settextcount] = useState(0);
  const [rating, setRating] = useState<number>(4);
  const [method, setMethod] = useState<'facebook' | 'google'>();

  const [retingShow, setRatingShow] = useState(true);

  const [URLValid, setURLValid] = useState<boolean>(false);

  useEffect(() => {
    if (getReviewLogoInfo?.data?.companyLogo) {
      setURLValid(true);
    }
  }, [getReviewLogoInfo?.data?.companyLogo]);

  type Method = 'facebook' | 'google';

  const methodHandeler = async (id, method: Method) => {
    await createClient({ id: id.toString(), method, rating });
  };
  const paly = () => {
    const audio = new Audio(boopSfx);
    audio.play();
  };

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);
  interface CreateClient {
    id: string | undefined;
    clientName?: string;
    clientMessage?: string;
    rating: number;
  }
  function textareachange(event: any) {
    const count = event.target.value.length;
    if (count > 0) {
      settextareabadge(true);
    } else {
      settextareabadge(false);
    }
    settextcount(event.target.value.length);
  }

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      //@ts-ignore
      id: id.toString(),
      clientMessage: '',
      clientName: 'name',
      rating,
    },
    validationSchema: Yup.object({
      clientMessage: Yup.string().required('Please Enter Your Textarea'),
      clientName: Yup.string(),
    }),
    onSubmit: async (values: CreateClient) => {
      await createClient({
        id: values.id,
        clientName: values.clientName,
        clientMessage: values.clientMessage,
        rating: values.rating,
      });
    },
  });

  return (
    <React.Fragment>
      {URLValid ? (
        <div className="page-content">
          <Container fluid={true}>
            <Row className="justify-content-center">
              <Col className="col-md-12 col-lg-7">
                <Card className="rounded-5 py-2">
                  <img
                    className="d-block m-auto rounded-2 mt-2"
                    style={{
                      height: '80px',
                      width: '150px',
                      objectFit: 'contain',
                    }}
                    src={`${getReviewLogoInfo?.data?.companyLogo}`}
                    alt="LOGO"
                  />
                  <CardBody>
                    <Row className="justify-content-center">
                      <Col>
                        {retingShow ? (
                          <div className="p-4 text-center">
                            <h5 className="font-16 m-b-15 fs-5">
                              We kindly invite you to rate our service using
                              below. Your feedback is greatly valued and helps
                              us improve.
                            </h5>

                            <Rating
                              className="d-block pb-2"
                              size={45}
                              initialValue={4}
                              transition
                              onClick={e => {
                                setRating(e);
                                paly();
                              }}
                            />

                            <div className=" d-flex justify-content-center pt-4">
                              <Button
                                className="rounded-5 d-flex justify-content-center  align-items-center"
                                value="large"
                                type="primary"
                                danger
                                style={{
                                  minWidth: '100px',
                                  overflow: 'hidden',
                                  minHeight: '50px',
                                }}
                                onClick={() => setRatingShow(false)}
                              >
                                <i className="bx bx-right-arrow-alt fs-2 animation"></i>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {rating > 3 ? (
                              <div className="mt-5 mb-3 rounded-4">
                                <h4 className=" text-center mb-4 fs-5 lh-base">
                                  Thank you for planning to review us! If you
                                  could share your experience on Google or
                                  social media, it would greatly benefit our
                                  community and help us grow.
                                </h4>
                                <div className="d-flex jsutify-content-center">
                                  <Link
                                    style={{
                                      display: `${
                                        getReviewLogoInfo?.data?.googleLink ===
                                        ''
                                          ? 'none'
                                          : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={
                                      getReviewLogoInfo?.data
                                        ?.googleLink as string
                                    }
                                    className="btn btn-primary  m-auto w-75  border-0"
                                    onClick={() => {
                                      methodHandeler(id, 'google');
                                      setMethod('google');
                                    }}
                                  >
                                    {isPending && method === 'google' ? (
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
                                      <i
                                        className="bx bxl-google"
                                        style={{ fontSize: '40px' }}
                                      ></i>
                                    )}
                                  </Link>
                                </div>
                                <div className="mt-3 d-flex jsutify-content-center">
                                  <Link
                                    style={{
                                      display: `${
                                        getReviewLogoInfo?.data
                                          ?.facebookLink === ''
                                          ? 'none'
                                          : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={
                                      getReviewLogoInfo?.data
                                        ?.facebookLink as string
                                    }
                                    className="btn btn-primary  m-auto w-75 border-0"
                                    type="submit"
                                    onClick={() => {
                                      methodHandeler(id, 'facebook');
                                      setMethod('facebook');
                                    }}
                                  >
                                    {isPending && method === 'facebook' ? (
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
                                      <i
                                        className="bx bxl-facebook-circle"
                                        style={{ fontSize: '40px' }}
                                      ></i>
                                    )}
                                  </Link>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="mt-1">
                                  <Form
                                    className="form-horizontal"
                                    onSubmit={e => {
                                      e.preventDefault();
                                      validation.handleSubmit();
                                      return false;
                                    }}
                                  >
                                    <div className="mb-3">
                                      <Label className="fs-5">
                                        Share your recent visit experience with
                                        us! Leave your name and feedback below.
                                      </Label>
                                      <Input
                                        style={{
                                          borderColor: '#F6653F',
                                        }}
                                        name="clientName"
                                        type="text"
                                        className="fs-5"
                                        onChange={validation.handleChange}
                                        value={
                                          validation.values.clientName || ''
                                        }
                                        placeholder="Enter Your Name "
                                      />
                                    </div>
                                    <div className="mb-3">
                                      {error ? (
                                        <Alert color="danger">{error}</Alert>
                                      ) : null}
                                      <Label className="fs-5">
                                        We value your feedback as it helps us
                                        enhance our services.
                                      </Label>
                                      <Input
                                        style={{
                                          height: '150px',
                                          borderColor: '#F6653F',
                                        }}
                                        name="clientMessage"
                                        type="textarea"
                                        id="clientMessage"
                                        className="fs-5"
                                        onChange={e => {
                                          textareachange(e);
                                          validation.handleChange(e);
                                        }}
                                        onBlur={validation.handleBlur}
                                        value={
                                          validation.values.clientMessage || ''
                                        }
                                        invalid={
                                          validation.touched.clientMessage &&
                                          validation.errors.clientMessage
                                            ? true
                                            : false
                                        }
                                        maxLength={900}
                                        rows="3"
                                        placeholder="Write your Feedback...."
                                      />
                                      {validation.touched.clientMessage &&
                                      validation.errors.clientMessage ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.clientMessage}
                                        </FormFeedback>
                                      ) : null}
                                      {textareabadge ? (
                                        <span className="badgecount badge bg-success">
                                          {' '}
                                          {textcount} / 900{' '}
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className=" d-flex justify-content-center pt-2">
                                      <button
                                        type="submit"
                                        style={{
                                          background: '#F6653F',
                                        }}
                                        // onClick={handleClick}
                                        className="btn btn-block fs-5 px-5 py-2 text-white fw-semibold rounded-5 shadow"
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
                                          <>Submit</>
                                        )}
                                      </button>
                                    </div>
                                  </Form>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </Col>
                    </Row>{' '}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className="d-flex justify-content-center text-black-50">
              <a
                href="https://www.logoinhours.com/"
                style={{
                  color: '#e1f3fc',
                }}
              >
                +
              </a>
              <span
                className="px-2 "
                style={{
                  color: '#e1f3fc',
                }}
              >
                |
              </span>
              <a
                href="https://www.fixwebsiteissues.com/website-maintenance-services/"
                className="="
                style={{
                  color: '#e1f3fc',
                }}
              >
                +
              </a>
            </div>
          </Container>
        </div>
      ) : (
        <h1 className="text-center p-3">This URL Not Valid</h1>
      )}
    </React.Fragment>
  );
};
export default ShortcutReview;
