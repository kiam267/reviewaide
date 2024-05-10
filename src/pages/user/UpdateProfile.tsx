import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, FormFeedback, Input, Label, Alert, Row, Col } from 'reactstrap';
import { Card, Spin } from 'antd';
// Redux
import withRouter from '../../Components/Common/withRouter';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import CustomeContainer from 'Components/Common/CustomeContainer';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useGetProfile, usePutUserInfo } from 'api/userApi';
const UpdateProfile = (props: any) => {
  const [isEdit, setIsEdit] = useState(true);
  const token = localStorage.getItem('user-token');
  const { getProfileInfo } = useGetProfile(token);
  const { userMoreInfo, isPending, isSuccess } = usePutUserInfo();

  useEffect(() => {
    setIsEdit(true);
  }, [isSuccess]);

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      fullName: getProfileInfo?.data?.fullName,
      phone: getProfileInfo?.data?.phone,
      companyName: getProfileInfo?.data?.companyName,
      googleLink: getProfileInfo?.data?.googleLink,
      facebookLink: getProfileInfo?.data?.facebookLink,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Please Enter Your fullName'),
      phone: Yup.number().required('Please Enter Your phone number'),
      companyName: Yup.string().required('Please Enter Your Company Name'),
      googleLink: Yup.string().required('Please Enter Your googleLink Link'),
      facebookLink: Yup.string().required(
        'Please Enter Your facebookLink Link'
      ),
    }),
    onSubmit: async (values: any, { setValues }) => {
      //@ts-ignore
      await userMoreInfo({ token, values });
    },
  });

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  const { error } = useSelector(selectProperties);
  return (
    <CustomeContainer>
      <Row className="justify-content-center">
        <Col sm={12} lg={6}>
          <Card>
            <Form
              className="form-horizontal"
              onSubmit={e => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label text-capitalize ">fullName</Label>
                <Input
                  name="fullName"
                  className="form-control"
                  placeholder="Enter fullName"
                  type="text"
                  disabled={isEdit}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.fullName || ''}
                  invalid={
                    validation.touched.fullName && validation.errors.fullName
                      ? true
                      : false
                  }
                />
                {validation.touched.fullName && validation.errors.fullName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.fullName}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label text-capitalize">phone</Label>
                <Input
                  name="phone"
                  className="form-control"
                  placeholder="Enter a phone"
                  disabled={isEdit}
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.phone || ''}
                  invalid={
                    validation.touched.phone && validation.errors.phone
                      ? true
                      : false
                  }
                />
                {validation.touched.phone && validation.errors.phone ? (
                  <FormFeedback type="invalid">
                    {validation.errors.phone}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label text-capitalize">
                  companyName
                </Label>
                <Input
                  name="companyName"
                  className="form-control"
                  disabled={isEdit}
                  placeholder="Enter a companyName"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.companyName || ''}
                  invalid={
                    validation.touched.companyName &&
                    validation.errors.companyName
                      ? true
                      : false
                  }
                />
                {validation.touched.companyName &&
                validation.errors.companyName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.companyName}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label text-capitalize">googleLink</Label>
                <Input
                  name="googleLink"
                  disabled={isEdit}
                  className="form-control"
                  placeholder="Enter  a googleLink"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.googleLink || ''}
                  invalid={
                    validation.touched.googleLink &&
                    validation.errors.googleLink
                      ? true
                      : false
                  }
                />
                {validation.touched.googleLink &&
                validation.errors.googleLink ? (
                  <FormFeedback type="invalid">
                    {validation.errors.googleLink}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {error ? <Alert color="danger">{error}</Alert> : null}
                <Label className="form-label text-capitalize">
                  facebookLink
                </Label>
                <Input
                  name="facebookLink"
                  disabled={isEdit}
                  className="form-control"
                  placeholder="Enter facebookLink"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.facebookLink || ''}
                  invalid={
                    validation.touched.facebookLink &&
                    validation.errors.facebookLink
                      ? true
                      : false
                  }
                />
                {validation.touched.facebookLink &&
                validation.errors.facebookLink ? (
                  <FormFeedback type="invalid">
                    {validation.errors.facebookLink}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mt-3 d-grid">
                {isEdit ? (
                  <div
                    className="btn btn-block fw-bold text-white fs-5"
                    style={{ background: '#FE9150' }}
                    onClick={() => setIsEdit(false)}
                  >
                    Edit
                  </div>
                ) : (
                  <button
                    className="btn btn-block fw-bold text-white fs-5"
                    type="submit"
                    style={{ background: '#FE9150' }}
                  >
                    {isPending ? (
                      <Spin
                        style={{
                          color: '#FFFFFF',
                        }}
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    ) : (
                      <>Update</>
                    )}
                  </button>
                )}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </CustomeContainer>
  );
};

export default withRouter(UpdateProfile);
