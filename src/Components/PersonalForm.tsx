import { Form, Upload, message } from 'antd';
import React, { useState } from 'react';
import CustomeInput from './CustomeInput';
import CustomePass from './CustomePass';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function PersonalInfoForm({ validation, error, onFileChanged, isLoding, setURL }) {

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  // const handleChange: UploadProps['onChange'] = info => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as FileType, url => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

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
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {isLoding ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <CustomeInput
        name="username"
        value={validation.values.username}
        placeholder="Enter Your  username"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.username}
        validationError={validation.errors.username}
        err={error}
      />
      <CustomeInput
        name="email"
        value={validation.values.email}
        placeholder="Enter Your email"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.email}
        validationError={validation.errors.email}
        err={error}
      />
      <CustomeInput
        name="phone"
        value={validation.values.phone}
        placeholder="Enter Your Phone Number"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.phone}
        validationError={validation.errors.phone}
        err={error}
      />
      <CustomePass
        name="password"
        value={validation.values.password}
        placeholder="Enter Your password"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.password}
        validationError={validation.errors.password}
        err={error}
      />
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={onFileChanged}
      >
        {setURL ? (
          <img src={setURL} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
}

export default PersonalInfoForm;
