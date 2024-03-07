import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dateFormat from 'dateformat';
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
import { getReview, privateReview } from 'api/clientVisitor';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  CLIENT_VISITOR_GET,
  CLIENT_VISITOR_METHODS,
  PRIVATE_REVIEW,
  REVIEW_LOGO_LINK,
  USER_UPDATE_SHORTCUT_POST_GET,
  USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST,
} from '../../helpers/url_helper';
import UserLogin from 'pages/auth/userLogin';
import Logout from 'pages/auth/Logout';
import { Button, message } from 'antd';

import boopSfx from '../../assets/sounds/mixkit-message-pop-alert-2354.mp3';
import { Text } from 'recharts';
const ShortcutReview = () => {
  //meta title

  const [textareabadge, settextareabadge] = useState(0) as any[];
  const [textcount, settextcount] = useState(0);
  const [rating, setRating] = useState<number>(4);
  const [show, setshow] = useState<boolean>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [LINK, SETLINK] = useState({
    google_link: '',
    facebook_link: '',
    helth_link: '',
    yel_link: '',
    logo: '',
  });

  const [retingShow, setRatingShow] = useState(true);
  const [validCookie, setValidCookie] = useState(false);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [URLValid, setURLValid] = useState<boolean>(false);

  console.log(LINK.helth_link === '');

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios
      .get(USER_UPDATE_SHORTCUT_POST_GET, {
        headers: { id },
      })
      .then(resp => {
        const res = resp.data;
        console.log(res.msg[0].data);
        if (res.msg.name === 'success') {
          SETLINK({ ...res.msg[0].data });
          return setURLValid(res.msg[0].valid);
        }
        if (res.msg.name === 'error') {
          return setURLValid(res.msg[0].valid);
        }
        if (res.msg.name === 'auth') {
          setValidCookie(true);
        }
      });
  }, []);

  const methodHandeler = (id, method) => {
    const now = new Date();
    const dateData = dateFormat(now, 'ddd, mmm dS, yyyy');
    const link = `${REVIEW_LOGO_LINK}/api/photos/${LINK.logo}`;
    axios.post(USER_UPDATE_SHORTCUT_PUBLICE_REVIEW_POST, {
      id,
      method,
      dateData,
      link,
    });
  };
  const paly = () => {
    const audio = new Audio(boopSfx);
    audio.play().catch(error => {
      // Handle the error, log it, or provide user instructions
      console.error('Failed to play audio:', error);
    });
  };

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);

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
      textarea: '',
      username: 'name',
      rating,
    },
    validationSchema: Yup.object({
      textarea: Yup.string().required('Please Enter Your Textarea'),
      username: Yup.string(),
    }),
    onSubmit: (values: any, { resetForm }) => {
      const now = new Date();
      const dateData = dateFormat(now, 'ddd, mmm dS, yyyy');
      const link = `${REVIEW_LOGO_LINK}/api/photos/${LINK.logo}`;
      axios
        .post(USER_UPDATE_SHORTCUT_POST_GET, {
          ...values,
          id,
          dateData,
          link,
        })
        .then(resp => {
          const res = resp.data;
          if (res.msg.name === 'error') {
            return message.error('You already Send Message');
          }
          if (res.msg.name === 'ZodError') {
            return setErrorMessage(res.msg.issues[0].message);
          }
          message.success(res.msg.msg);
          resetForm();
          return;
        });
    },
  });

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // Additional logic or actions you want to perform on button click
  };
  if (validCookie) {
    return <Logout />;
  }
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
                    //${LINK.logo}
                    src={`${REVIEW_LOGO_LINK}/api/photos/${LINK.logo}`}
                    alt="LOGO"
                  />
                  <CardBody>
                    <Alert
                      color="danger"
                      className={`${errorMessage ? 'd-block' : 'd-none'} mt-1`}
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
                                <div>
                                  <Link
                                    style={{
                                      display: `${
                                        LINK.google_link === ''
                                          ? 'none'
                                          : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={LINK.google_link}
                                    className="btn btn-primary  m-auto w-75"
                                    type="submit"
                                    onClick={() => methodHandeler(id, 'google')}
                                  >
                                    <i
                                      className="bx bxl-google"
                                      style={{ fontSize: '40px' }}
                                    ></i>
                                  </Link>
                                </div>
                                <div className="mt-3">
                                  <Link
                                    style={{
                                      display: `${
                                        LINK.facebook_link === ''
                                          ? 'none'
                                          : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={LINK.facebook_link}
                                    className="btn btn-primary  m-auto w-75"
                                    type="submit"
                                    onClick={() =>
                                      methodHandeler(id, 'facebook')
                                    }
                                  >
                                    <i
                                      className="bx bxl-facebook-circle"
                                      style={{ fontSize: '40px' }}
                                    ></i>
                                  </Link>
                                </div>
                                <div className="mt-3">
                                  <Link
                                    style={{
                                      display: `${
                                        LINK.yel_link === '' ? 'none' : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={LINK.yel_link}
                                    className="btn btn-primary  m-auto w-75"
                                    type="submit"
                                    onClick={() => methodHandeler(id, 'Yelp')}
                                  >
                                    <i
                                      className="bx bxl-yelp"
                                      style={{ fontSize: '40px' }}
                                    ></i>
                                  </Link>
                                </div>
                                <div className="mt-3">
                                  <Link
                                    style={{
                                      display: `${
                                        LINK.helth_link === ''
                                          ? 'none'
                                          : 'block'
                                      }`,
                                      background: '#F6653F',
                                    }}
                                    to={LINK.helth_link}
                                    className="btn btn-primary  m-auto w-75 "
                                    type="submit"
                                    onClick={() =>
                                      methodHandeler(id, 'Health Grades')
                                    }
                                  >
                                    <div className="d-flex justify-content-center  align-items-center">
                                      <i
                                        className="bx bx-heart"
                                        style={{ fontSize: '40px' }}
                                      ></i>
                                      <span className="ms-2 fs-4">
                                        Health Grades
                                      </span>
                                    </div>
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
                                        name="username"
                                        type="text"
                                        className="fs-5"
                                        onChange={validation.handleChange}
                                        value={validation.values.username || ''}
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
                                        name="textarea"
                                        type="textarea"
                                        id="textarea"
                                        className="fs-5"
                                        onChange={e => {
                                          textareachange(e);
                                          validation.handleChange(e);
                                        }}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.textarea || ''}
                                        invalid={
                                          validation.touched.textarea &&
                                          validation.errors.textarea
                                            ? true
                                            : false
                                        }
                                        maxLength={900}
                                        rows="3"
                                        placeholder="Write your Feedback...."
                                      />
                                      {validation.touched.textarea &&
                                      validation.errors.textarea ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.textarea}
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
                                          boxShadow: clicked
                                            ? '0 0 10px rgba(0, 0, 0, 0.5)'
                                            : 'none',
                                          transition:
                                            'box-shadow 0.3s ease-in-out',
                                          animation: clicked
                                            ? 'moveRight 0.5s ease-in-out'
                                            : 'none',
                                        }}
                                        onClick={handleClick}
                                        className="btn btn-block fs-5 px-5 py-2 text-white fw-semibold rounded-5 shadow"
                                      >
                                        Submit
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
