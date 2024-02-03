import { Form } from 'antd';
import React from 'react';
import CustomeInput from './CustomeInput';
import CustomePass from './CustomePass';

function PersonalInfoForm({ validation, error }) {
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
    </div>
  );
}

export default PersonalInfoForm;
