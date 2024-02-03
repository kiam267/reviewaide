import React, { ChangeEvent, FocusEvent } from 'react';
import { Alert, FormFeedback, Input, Label } from 'reactstrap';

interface CustomInputProps {
  err: boolean;
  name: string;
  placeholder: string;
  value: string;
  validationError: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  touchedError: boolean;
}

function CustomeInput({
  err,
  name,
  placeholder,
  value,
  validationError,
  handleChange,
  handleBlur,
  touchedError,
}: CustomInputProps) {
  return (
    <div>
      <div className="mb-3">
        {err ? <Alert color="danger">{err}</Alert> : null}
        <Label className="form-label">{name}</Label>
        <Input
          name={name}
          className="form-control"
          placeholder={placeholder}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={value || ''}
          invalid={touchedError && validationError}
        />
        {touchedError && validationError && (
          <FormFeedback type="invalid">{validationError}</FormFeedback>
        )}
      </div>
    </div>
  );
}

export default CustomeInput;
