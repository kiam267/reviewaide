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
// import { resetLoginMsgFlag } from 'slices/auth/login/thunk';

import withRouter from 'Components/Common/withRouter';
import { createSelector } from 'reselect';
import { useUserAuth } from 'contexts/UserAuth';
import { userGet, userUpdate } from 'api/userUpdate';
import CustomeInput from 'Components/CustomeInput';
import CustomeContainer from 'Components/Common/CustomeContainer';
import { Button, Modal, Space, Steps, message } from 'antd';
import PersonalInfoForm from 'Components/PersonalForm';
import CompnayDetailForm from 'Components/CompanyDetailForm';
import dateFormat from 'dateformat';
import type { GetProp, UploadProps } from 'antd';
import axios from 'axios';
import { CREATE_USERS, USER_UPDATE } from '../../helpers/url_helper';
import { useResetIconStyle } from 'antd/es/theme/internal';
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
  const { storeToken, LogoutUser, token, IsValidUSER, isNewUser, avater } =
    useUserAuth();
  const dispatch: any = useDispatch();
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const navigation = useNavigate();
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [isValid, setIsValid] = useState(
    Boolean(Number(localStorage.getItem('isValid')))
  );
  const [checkFirstUser, setCheckFirstUser] = useState();
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  const nevigation = useNavigate();
  const { error } = useSelector(selectProperties);
  useEffect(() => {
    const now = new Date();
    setDate(dateFormat(now, 'ddd, mmm dS, yyyy'));
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(CREATE_USERS, {
  //       headers: { token: token },
  //     })
  //     .then(user => {
  //       // if (!user.valid) {
  //       //   LogoutUser();
  //       // }
  //       console.log(user);
  //       localStorage.setItem('isValid', user.isValid);
  //       setCheckFirstUser(user.isValid);
  //       return;
  //     });
  // }, []);

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onFileChanged = info => {
    setImageURL(info.file.originFileObj);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.

      setLoading(false);
      getBase64(info.file.originFileObj as FileType, url => {
        setImageUrl(url);
      });
    }
  };
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
      temporary: '',
      editEmail: '',
      editSms: '',
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
      temporary: Yup.number().required('Please Enter Your Facebook Link'),
      editEmail: Yup.string().required('Please Edit Your Email'),
      editSms: Yup.string().required('Please Edit Your SMS'),
    }),
    onSubmit: async (values: any, { setValues }) => {
      const data = { imageURL, ...values, date, token };
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      };
      axios.put(USER_UPDATE, data, config).then(resp => {
           const res = resp.data;
        if (res.msg.name === 'error') {
          return message.error(res.msg.msg);
        }
        storeToken(res.token);
        isNewUser(1);
        avater(`/uploads/${res.avater}`, res.username);
        message.success(res.msg.msg);
        return navigation('/');
      });
    },
  });

  // useEffect(() => {
  //   if (error) {
  //     setTimeout(() => {
  //       dispatch(resetLoginMsgFlag());
  //     }, 3000);
  //   }
  // }, [dispatch, error]);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  if (checkFirstUser) {
    nevigation('/user');
  }
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
              <PersonalInfoForm
                validation={validation}
                error={error}
                onFileChanged={onFileChanged}
                isLoding={loading}
                setURL={imageUrl}
              />
            ) : (
              <CompnayDetailForm validation={validation} error={error} />
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            {current === steps.length - 1 && (
              <Button
                style={{ background: '#F77857' }}
                className="text-white fw-semibold"
                htmlType="submit"
              >
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
            <Button
              style={{ background: '#F77857' }}
              className="text-white fw-semibold"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
        </div>
      </Modal>
    </CustomeContainer>
  );
};

export default withRouter(UpdateProfile);
