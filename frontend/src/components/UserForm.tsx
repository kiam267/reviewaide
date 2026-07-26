import React, { useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Input, Label, FormFeedback, Alert } from 'reactstrap';
import { GetProp, Spin, Upload, UploadProps, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { usePutUserInfo } from 'api/userApi';
import { log } from 'console';
function UserForm() {
  const [fileDetails, setFileDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [base64URL, setBase64URL] = useState('');
  const nevigation = useNavigate();
  const { userMoreInfo, isPending, isSuccess } = usePutUserInfo();
  const [userReponse, setUserResponse] = useState({
    tokenInvalid: null,
  });

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const token = localStorage.getItem('user-token');

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
      companyLogo: fileDetails,
      companyName: '',
      googleLink: '',
      facebookLink: '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Please enter company name'),
      googleLink: Yup.string().required('Please enter google link'),
      facebookLink: Yup.string().required('Please enter facebook link'),
    }),
    onSubmit: async (values: UserMoreDetailInfo) => {
      const userData = { ...values };
      await userMoreInfo({ token, values: userData });
    },
  });
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onFileChanged = e => {
    const selectedFile = e.file.originFileObj;
    console.log(selectedFile);

    setFileDetail(selectedFile);
    if (selectedFile) {
      getBase64(selectedFile)
        .then(result => {
          setFile(selectedFile);
          setBase64URL(result as any);
        })
        .catch(error => {
          console.error('Error converting file to base64:', error);
        });
    }
  };

  if (isSuccess) {
   return <Navigate to="/" />;
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
      <h1 className="fs-1 fw-bold my-5">Give me comapany details</h1>
      <Upload
        name="companyLogo"
        listType="picture"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={onFileChanged}
      >
        {base64URL ? (
          <img
            src={base64URL}
            alt="companyLogo"
            className="my-4"
            style={{ width: '100%' }}
          />
        ) : (
          uploadButton
        )}
      </Upload>

      <div className="mb-5">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Company Name</Label>
        <Input
          name="companyName"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your email"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.companyName || ''}
          invalid={
            validation.touched.companyName && validation.errors.companyName
              ? true
              : false
          }
        />
        {validation.touched.companyName && validation.errors.companyName ? (
          <FormFeedback type="invalid">
            {validation.errors.companyName}
          </FormFeedback>
        ) : null}
      </div>

      <div className="mb-5">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Google Link</Label>
        <Input
          name="googleLink"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your email"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.googleLink || ''}
          invalid={
            validation.touched.googleLink && validation.errors.googleLink
              ? true
              : false
          }
        />
        {validation.touched.googleLink && validation.errors.googleLink ? (
          <FormFeedback type="invalid">
            {validation.errors.googleLink}
          </FormFeedback>
        ) : null}
      </div>
      <div className="mb-5">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <Label className="form-label fs-5">Facebook Link</Label>
        <Input
          name="facebookLink"
          className="form-control rounded-4 fs-5"
          placeholder="Enter your email"
          type="text"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.facebookLink || ''}
          invalid={
            validation.touched.facebookLink && validation.errors.facebookLink
              ? true
              : false
          }
        />
        {validation.touched.facebookLink && validation.errors.facebookLink ? (
          <FormFeedback type="invalid">
            {validation.errors.facebookLink}
          </FormFeedback>
        ) : null}
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
            <>Update</>
          )}
        </button>
      </div>
    </Form>
  );
}

export default UserForm;
