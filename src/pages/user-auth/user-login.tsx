import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { useUserAuth } from 'contexts/UserAuth';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import CustomePass from 'Components/CustomePass';
import { useMatchMyUser } from 'api/userApi';

const UserLogin = (props: any) => {
  const { userLogin, isPending } = useMatchMyUser();
  const { isLoggedIn } = useUserAuth();
  const nevigation = useNavigate();

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
      email: 'vendor@gmail.com',
      password: 'vendor@gmail.com',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required('Please Enter Your email'),
      password: Yup.string()
        .trim()
        .required('Please Enter Your Password'),
    }),
    onSubmit: (values: Login) => {
      userLogin(values);
      console.log(isPending);
    },
  });

  if (isLoggedIn) {
    nevigation('/user');
    return null;
  }
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
      <div className="my-3">
        <Link
          className="fs-6 text-decoration-none text-gradients fw-semibold py-5"
          to="/user/forgot-password"
        >
          Forget Password
        </Link>
      </div>

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
            <>Log In</>
          )}
        </button>
        <div className="my-3">
          <span>Don't have an account?</span>
          <Link
            className="fs-6 text-decoration-none text-gradients fw-semibold ps-2"
            to="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default withRouter(UserLogin);
