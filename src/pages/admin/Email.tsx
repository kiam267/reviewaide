import React, { useState } from 'react';
import {
  Alert,
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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
//Import Flatepicker
import 'flatpickr/dist/themes/material_blue.css';

//Import Breadcrumb
import Breadcrumbs from '../../Components/Common/Breadcrumb';
import AllContainer from 'Components/Common/CustomeContainer';
// import EmailInbox from 'pages/Email/email-inbox';
// import EmailToolbar from 'pages/Email/email-toolbar';

const optionGroup = [
  { label: 'Tent', value: 'Tent' },
  { label: 'Flashlight', value: 'Flashlight' },
  { label: 'Toilet Paper', value: 'Toilet Paper' },
];

const Email = () => {
  //meta title
  document.title = 'Form Advanced | Skote - React Admin & Dashboard Template';

  const [selectedGroup, setselectedGroup] = useState(null) as any[];

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  function handleSelectGroup(selectedGroup: any) {
    setselectedGroup(selectedGroup);
  }
  const dispatch: any = useDispatch();
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      phone: Yup.string().required('Please Enter Your Phone Number'),
    }),
    onSubmit: (values: any) => {
      // userSchedule(values).then(res => {
      //   if (res.msg.name === 'error') {
      //     return setErrorMessage(res.msg.msg);
      //   }
      //   return setAdminMessage(res.msg.msg);
      // });
    },
  });

  return (
    <React.Fragment>
      <AllContainer>
        <Breadcrumbs title="Send Email" breadcrumbItem="Email " />

        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="pt-0">
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Email Address</Label>
                      <Select
                        value={selectedGroup}
                        onChange={() => {
                          handleSelectGroup(setselectedGroup);
                        }}
                        options={optionGroup}
                        className="select2-selection"
                      />
                    </div>
                  </Col>
                </Row>
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
                        placeholder="Enter Your Email"
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
                      {error ? <Alert color="danger">{error}</Alert> : null}
                      <Label className="form-label">Phone</Label>
                      <Input
                        name="phone"
                        className="form-control"
                        placeholder="Enter Your Phone Number"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.phone || ''}
                        invalid={
                          validation.touched.phone && validation.errors.phone
                            ? true
                            : false
                        }
                      />
                      {validation.touched.phone && validation.errors.phone ? (
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
                        placeholder="Enter email"
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
        {/* <Em></Em> */}
      </AllContainer>
    </React.Fragment>
  );
};

export default Email;
