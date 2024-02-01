import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
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
const Review = () => {
  //meta title
  document.title = 'Rating | Skote - React Admin & Dashboard Template';
  const [textareabadge, settextareabadge] = useState(0) as any[];
  const [textcount, settextcount] = useState(0);
  const [rating, setRating] = useState<number>(1);
  const [show, setshow] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  const { clientId } = useParams();

  useEffect(() => {
    getReview(clientId).then(res => setshow(res.isSend));
  }, [show]);
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
      clientId,
      rating,
    },
    validationSchema: Yup.object({
      textarea: Yup.string().required('Please Enter Your Textarea'),
    }),
    onSubmit: (values: any) => {
      privateReview(values).then(res => {
        if (res.msg.name === 'error') {
          return setErrorMessage(res.msg.msg);
        }
        if (res.msg.name === 'ZodError') {
          return setErrorMessage(res.msg.issues[0].message);
        }
        setAdminMessage(res.msg.msg);
        return;
      });
    },
  });

  if (show) {
    return <Navigate to="/werwer" />;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row className="justify-content-center">
            <Col className="col-md-12 col-lg-7">
              <Card>
                <CardBody>
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
                  <Row className="justify-content-center">
                    <Col>
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          Please! Share Your Review
                        </h5>
                        <Rating
                          size={45}
                          initialValue={1}
                          transition
                          onClick={e => setRating(e)}
                        />
                      </div>
                      {rating > 3 ? (
                        <div className="mt-5">
                          <h4 className="fs-5 text-center fw-semibold">
                            Please Share Your Review On This Site.
                          </h4>
                          <div className="mt-3">
                            <Link
                              to="https://g.page/r/CSdkl6PngXjUEB0/review"
                              className="btn btn-primary d-block m-auto w-75"
                              type="submit"
                            >
                              <i
                                className="bx bxl-google"
                                style={{ fontSize: '40px' }}
                              ></i>
                            </Link>
                          </div>
                          <div className="mt-3">
                            <button
                              className="btn btn-primary d-block m-auto w-75"
                              type="submit"
                              disabled
                            >
                              <i
                                className="bx bxl-facebook-circle"
                                style={{ fontSize: '40px' }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mt-3">
                            <Form
                              className="form-horizontal"
                              onSubmit={e => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                            >
                              <div className="mb-3">
                                {error ? (
                                  <Alert color="danger">{error}</Alert>
                                ) : null}
                                <Label>Textarea</Label>
                                <Input
                                  name="textarea"
                                  type="textarea"
                                  id="textarea"
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
                                  maxLength={350}
                                  rows="3"
                                  placeholder="Please describe Our Problem."
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
                                    {textcount} / 350{' '}
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-3 d-block w-25 mx-auto">
                                <button
                                  className="btn btn-primary btn-block "
                                  type="submit"
                                >
                                  Submit
                                </button>
                              </div>
                            </Form>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>{' '}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Review;
