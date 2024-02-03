import React, { useEffect, useState } from 'react';

// Redux
import { Link, useNavigate, Navigate } from 'react-router-dom';
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
import { resetLoginMsgFlag } from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { useUserAuth } from 'contexts/UserAuth';
import { userUpdate } from 'api/userUpdate';
import CustomeInput from 'Components/CustomeInput';
import CustomeContainer from 'Components/Common/CustomeContainer';
import { Button, Modal, Space, Steps, message } from 'antd';
import PersonalInfoForm from 'Components/PersonalForm';
import CompnayDetailForm from 'Components/CompanyDetailForm';
import dateFormat from 'dateformat';
import { getUser } from 'api/createUsers';
const steps = [
  {
    title: 'Personal Detail',
  },
  {
    title: 'Compnany Detail',
  },
];

const UpdateProfile = (props: any) => {
  const [show, setShow] = useState(false);
  const { storeToken } = useUserAuth();
  const dispatch: any = useDispatch();
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const navigation = useNavigate();
  const [date, setDate] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(
    Boolean(Number(localStorage.getItem('isValid')))
  );
  console.log('oks');
  
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  useEffect(() => {
    getUser().then(user => {
      setIsValid(user.isValid);
      localStorage.setItem('isValid', user.isValid);
    });
  }, []);

  const { error } = useSelector(selectProperties);
  useEffect(() => {
    const now = new Date();
    setDate(dateFormat(now, 'ddd, mmm dS, yyyy'));
  }, []);

  // Form validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: '',
      email: '',
      password: '',
      phone: '',
      companyName: '',
      google: '',
      facebook: '',
      temporray: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please Enter Your Username'),
      email: Yup.string()
        .email('Email Not Valid')
        .required('Please Enter Your email'),
      phone: Yup.number().required('Please Enter Your email'),

      password: Yup.string().required('Please Enter Your Password'),
      companyName: Yup.string().required('Please Enter Your Company Name'),
      google: Yup.string().required('Please Enter Your google Link'),
      facebook: Yup.string().required('Please Enter Your Facebook Link'),
      temporray: Yup.number().required('Please Enter Your Facebook Link'),
    }),
    onSubmit: (values: any) => {
      const data = { ...values, date };
      userUpdate(data).then(res => {
        if (res.msg.name === 'error') {
          return message.error(res.msg.msg);
        }
        if (res.msg.name === 'ZodError') {
          return message.error(res.msg.issues[0].message);
        }
        storeToken(res.token);
        localStorage.setItem('isValid', res.isValid);
        message.success(res.msg.msg);
        navigation('/send');
        console.log('ok');

        return;
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

  if (isValid) {
    return navigation('/user');
  }
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <CustomeContainer>
      <Modal open={open} footer={<></>} className="">
        <Steps current={current} items={items} className="mt-5" />

        <Form
          className="form-horizontal mt-5"
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div>
            {current === 0 ? (
              <PersonalInfoForm validation={validation} error={error} />
            ) : (
              <CompnayDetailForm validation={validation} error={error} />
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </Form>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
        </div>
      </Modal>
    </CustomeContainer>
  );
};

export default withRouter(UpdateProfile);
