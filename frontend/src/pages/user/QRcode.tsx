import React, { useEffect, useState } from 'react';
import CustomeContainer from 'Components/Common/CustomeContainer';

import { Card, QRCode, Button, Modal } from 'antd';
import Logout from 'pages/auth/Logout';
import { Row, Col } from 'reactstrap';
import {
  useDeleteClientLink,
  useGetClientLink,
  useCretaeQrCodeLink,
} from 'api/clientApi';

import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Input, Label, FormFeedback, Alert } from 'reactstrap';
import { GetProp, Spin, Upload, UploadProps, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { REVIEW_LINK } from '../../helpers/url_helper';
function QRcode() {
  const token: string | null = localStorage.getItem('user-token');

  //@ts-ignore
  const { getClientLinkInfo, refetch } = useGetClientLink(token);

  const handelQrCodeGenThenReaf = async () => {
    refetch();
    // setIsModalOpen(false);
  };

  // useEffect(() => {
  //   refetch();
  // }, [isDeleteSuccess]);

  const [QRcodeStatus, setQRcodeStatus] = useState<'active' | 'loading'>(
    'loading'
  );
  const [beforeCreateQRcode, setBeforeCreateQRcode] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setBeforeCreateQRcode(!!getClientLinkInfo?.data);
    setQRcodeStatus(getClientLinkInfo?.data ? 'active' : 'loading');
  }, [getClientLinkInfo?.data]);

  if (getClientLinkInfo?.tokenInvalid) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Row className="justify-content-center">
        {getClientLinkInfo?.data?.map(link => {
          if (link.uniqueId === '0') {
            return;
          }
          return (
            <Col sm={12} md={6} lg={3} key={link.uniqueId}>
              <Card className="my-4 d-flex justify-content-center rounded-5">
                <QrCodeItem
                  itemLogo={link.companyLogo}
                  haveAnyItem={beforeCreateQRcode}
                  item={link.uniqueId}
                  status={QRcodeStatus}
                  handelQrCodeGenThenReaf={handelQrCodeGenThenReaf}
                  itemName={link.companyName}
                />
              </Card>
            </Col>
          );
        })}
        <Col sm={12} md={6} lg={3}>
          <Card className="my-4 d-flex justify-content-center rounded-5 align-items-end">
            <i
              onClick={showModal}
              className="bx bxs-plus-circle d-flex justify-content-center  align-items-center"
              style={{
                fontSize: '7rem',
                minHeight: '250px',
                height: '100%',
                cursor: 'pointer',
              }}
            ></i>

            <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
              <QrGenForm handelQrCodeGenThenReaf={handelQrCodeGenThenReaf} />
            </Modal>
          </Card>
        </Col>
      </Row>
    </CustomeContainer>
  );
}

export default QRcode;

function QrGenForm({
  handelQrCodeGenThenReaf,
}: {
  handelQrCodeGenThenReaf: () => void;
}) {
  const [fileDetails, setFileDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [base64URL, setBase64URL] = useState('');
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  // api call to create a new qr code
  const token: string | null = localStorage.getItem('user-token');
  const { createQRCode, isSuccess, isPending } = useCretaeQrCodeLink();
  const { error } = useSelector(selectProperties);

  useEffect(() => {
    handelQrCodeGenThenReaf();
  }, [isSuccess]);

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
      googleLink: Yup.string(),
      facebookLink: Yup.string(),
    }),
    onSubmit: async (values: UserMoreDetailInfo, { resetForm }) => {
      const userData = { ...values };
      //@ts-ignore
      await createQRCode({ token, user: userData });
      resetForm();
      setFileDetail(null);
      setBase64URL('');
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

  return (
    <Form
      className="form-horizontal "
      onSubmit={e => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <h1 className="fs-4 fw-bold my-5 text-secondary">
        Give me your details{' '}
      </h1>
      <Upload
        name="companyLogo"
        listType="picture"
        className="avatar-uploader d-flex justify-content-center "
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={onFileChanged}
      >
        <div
          className="my-3 border rounded-circle  d-flex justify-content-center align-items-center shadow-lg"
          style={{
            // border:
            width: '100px',
            height: '100px',
            overflow: 'hidden',
          }}
        >
          {base64URL ? (
            <img
              src={base64URL}
              alt="companyLogo"
              // className="my-4"
              style={{ width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="d-block">
              <i
                className="bx bx-upload"
                style={{
                  fontSize: '3rem',
                }}
              ></i>
            </div>
          )}
        </div>
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
            <>Create</>
          )}
        </button>
      </div>
    </Form>
  );
}

function QrCodeItem({
  item,
  status,
  haveAnyItem,
  handelQrCodeGenThenReaf,
  itemName,
  itemLogo,
}: {
  item: string;
  status: 'loading' | 'active';
  haveAnyItem: boolean;
  handelQrCodeGenThenReaf: () => void;
  itemName: string;
  itemLogo: string;
}) {
  const downloadQRCode = ({ id }) => {
    const canvas = document
      .getElementById(`myqrcode-${id}`) // Use unique ID
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = 'QRCode.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  // api call for deleting current qrcode image
  const token: string | null = localStorage.getItem('user-token');
  const { createClient, isSuccess, isPending } = useDeleteClientLink();
  const QRCodeDeleteButton = async ({ id }) => {
    await createClient({
      //@ts-ignore
      token,
      uniqueId: id,
    });
  };
  useEffect(() => {
    handelQrCodeGenThenReaf();
  }, [isSuccess]);
  return (
    <div id={`myqrcode-${item}`}>
      <>
        <img
          src={itemLogo}
          alt="logo"
          width={40}
          height={40}
          className="d-block m-auto my-2 rounded-circle"
          style={{ objectFit: 'contain' }}
        />
        <p className="text-center text-secondary fs-6">{itemName}</p>

        <QRCode
          status={status}
          value={`${REVIEW_LINK}/review/shortcut/${item}`}
          bgColor="#fff"
          style={{ marginBottom: 16 }}
        />
        <div className="gap-3 d-flex justify-content-center">
          <Button
            type="primary"
            className="m-auto d-block"
            onClick={() => downloadQRCode({ id: item })}
            disabled={status === 'loading' && true}
          >
            Download
          </Button>
          <Button
            type="primary"
            danger
            className={`m-auto  ${haveAnyItem ? 'd-block' : 'd-none '}`}
            onClick={() => QRCodeDeleteButton({ id: item })}
          >
            {isPending ? (
              <Spin
                style={{
                  color: '#FFFFFF',
                }}
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : (
              <>Delete</>
            )}
          </Button>
        </div>
      </>
    </div>
  );
}
