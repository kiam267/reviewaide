import React from 'react';

import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
} from 'reactstrap';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector} from 'react-redux';
import { createSelector } from 'reselect';


import CustomePass from 'Components/CustomePass';
import { useCreateUser } from 'api/userApi';
function UserSignUp() {
  const { userSignUp, isPending } = useCreateUser();
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);

  // Form validation
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your email').trim(),
      password: Yup.string().required('Please Enter Your Password'),
      fullName: Yup.string().required('Please Enter Your Password'),
      phone: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: async (values: SignUp) => {
      userSignUp(values);
    },
  });

  return (
    <Form
      className="form-horizontal login-form"
      onSubmit={e => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      
      <h1 className="text-center fs-1 fw-semibold my-5">
        Wellcome to our <span className="text-gradients">ReviewAide</span>
      </h1>
      <div className="mb-3">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Full Name</Label>
        <Input
          name="fullName"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your full name"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.fullName || ''}
          invalid={
            validation.touched.fullName && validation.errors.fullName
              ? true
              : false
          }
        />
        {validation.touched.fullName && validation.errors.fullName ? (
          <FormFeedback type="invalid">
            {validation.errors.fullName}
          </FormFeedback>
        ) : null}
      </div>
      <div className="mb-3">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Phone Number</Label>
        <Input
          name="phone"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your phone number"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.phone || ''}
          invalid={
            validation.touched.phone && validation.errors.phone ? true : false
          }
        />
        {validation.touched.phone && validation.errors.phone ? (
          <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
        ) : null}
      </div>
      <div className="mb-3">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Email</Label>
        <Input
          name="email"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your email"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.email || ''}
          invalid={
            validation.touched.email && validation.errors.email ? true : false
          }
        />
        {validation.touched.email && validation.errors.email ? (
          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
        ) : null}
      </div>
      <CustomePass
        className="rounded-start-pill fs-5 "
        buttonClassName="rounded-end-pill"
        name="password"
        handleBlur={validation.handleBlur}
        handleChange={validation.handleChange}
        placeholder="Enter your password"
        touchedError={validation.touched.password}
        validationError={validation.errors.password}
        value={validation.values.password}
      />

      <div className="my-3 d-grid ">
        <button
          aria-disabled={isPending}
          // disabled={isPending}
          className="btn btn-block fw-bold text-white fs-5 rounded-5"
          type="submit"
          style={{ background: '#FE9150' }}
        >
          {isPending ? (
            <Spin
              style={{
                color: '#FFFFFF',
              }}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : (
            <> Sign up</>
          )}
        </button>
        <div className="my-3">
          <span>Already have an account?</span>
          <Link
            className="fs-6 text-decoration-none text-gradients fw-semibold ps-2"
            to="/"
          >
            Log In
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default UserSignUp;
