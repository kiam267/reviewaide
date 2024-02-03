import { Form } from 'antd';
import React from 'react';
import CustomeInput from './CustomeInput';
import CustomePass from './CustomePass';

function CompnayDetailForm({ validation, error }) {
  return (
    <div>
      <CustomeInput
        name="companyName"
        value={validation.values.companyName}
        placeholder="Enter Your  username"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.companyName}
        validationError={validation.errors.companyName}
        err={error}
      />
      <CustomeInput
        name="google"
        value={validation.values.google}
        placeholder="Enter Your google Link"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.google}
        validationError={validation.errors.google}
        err={error}
      />
      <CustomeInput
        name="facebook"
        value={validation.values.facebook}
        placeholder="Enter Your facebook Link"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.facebook}
        validationError={validation.errors.facebook}
        err={error}
      />
      <CustomePass
        name="temporray"
        value={validation.values.temporray}
        placeholder="Enter Your temporray Code"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.temporray}
        validationError={validation.errors.temporray}
        err={error}
      />
    </div>
  );
}

export default CompnayDetailForm;
