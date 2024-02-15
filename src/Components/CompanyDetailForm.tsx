import { Alert, Form, Space } from 'antd';
import React from 'react';
import CustomeInput from './CustomeInput';
import CustomePass from './CustomePass';
import { FormFeedback, Input, Label } from 'reactstrap';

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
        name="temporary"
        value={validation.values.temporary}
        placeholder="Enter Your Temporary Code"
        handleChange={validation.handleChange}
        handleBlur={validation.handleBlur}
        touchedError={validation.touched.temporary}
        validationError={validation.errors.temporary}
        err={error}
      />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="you must use ${name}, ${compnayName}, ${link}  "
          type="info"
        />
      </Space>
      <Label className="text-capitalize">edit email</Label>
      <Input
        name="editEmail"
        type="textarea"
        id="textarea"
        onChange={e => validation.handleChange(e)}
        onBlur={validation.handleBlur}
        value={validation.values.editEmail || ''}
        invalid={
          validation.touched.editEmail && validation.errors.editEmail
            ? true
            : false
        }
        placeholder="Hi ${name} Thanks for visiting ${compnayName}!. Shere your feedback at ${link}"
      />
      {validation.touched.editEmail && validation.errors.editEmail ? (
        <FormFeedback type="invalid">
          {validation.errors.editEmail}
        </FormFeedback>
      ) : null}

      <Label>edit sms</Label>
      <Input
        name="Edit SMS"
        type="textarea"
        id="textarea"
        onChange={e => validation.handleChange(e)}
        onBlur={validation.handleBlur}
        value={validation.values.editSms || ''}
        invalid={
          validation.touched.editSms && validation.errors.editSms ? true : false
        }
        placeholder="Hi ${name} Thanks for visiting ${compnayName}!. Shere your feedback at ${link}"
      />
      {validation.touched.editSms && validation.errors.editSms ? (
        <FormFeedback type="invalid">{validation.errors.editSms}</FormFeedback>
      ) : null}
    </div>
  );
}

export default CompnayDetailForm;
