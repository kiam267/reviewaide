import React, { ChangeEvent, FocusEvent, useState } from 'react';
import { Alert, FormFeedback, Input, Label } from 'reactstrap';

interface CustomInputProps {
  err?: boolean;
  name: string;
  placeholder: string;
  value: string;
  validationError: boolean | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  touchedError: boolean | undefined;
}

function CustomePass({
  err,
  name,
  placeholder,
  value,
  validationError,
  handleChange,
  handleBlur,
  touchedError,
}: CustomInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="mb-3">
        {err ? <Alert color="danger">{err}</Alert> : null}
        <Label className="form-label text-capitalize">{name}</Label>
        <div className="input-group auth-pass-inputgroup">
          <Input
            name={name}
            className="form-control"
            placeholder={placeholder}
            type={show ? 'text' : 'password'}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value || ''}
            invalid={touchedError && validationError}
          />
          <button
            onClick={() => setShow(!show)}
            className="btn btn-light "
            type="button"
            id="password-addon"
          >
            <i className="mdi mdi-eye-outline"></i>
          </button>
        </div>
        {touchedError && validationError && (
          <FormFeedback type="invalid">{validationError}</FormFeedback>
        )}
      </div>
    </div>
  );
}

export default CustomePass;
