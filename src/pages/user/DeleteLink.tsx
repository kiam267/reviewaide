import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Drawer,
  Empty,
  Popover,
  QRCode,
  Space,
  Table,
  Upload,
  message,
} from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { TableProps } from 'antd';
import axios from 'axios';
import Logout from 'pages/auth/Logout';
import {
  USER_UPDATE_SHORTCUT,
  LINK,
  AVATER_IMAGE_URL,
} from '../../helpers/url_helper';

import { Form, FormFeedback, Input, Label, Alert as REAlert } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
interface DataType {
  name: string;
  logo: string;
  google_link: string;
  facebook_link: string;
  review_link: string;
  qr_code: string;
  yel_link: string;
  helth_link: string;
  unique_id: string;
  id: number | string;
  valid: number | string;
  user_email: string;
  custom_url: string;
  custom_phato_url: string;
}

function DeleteLink() {
  const [validCookie, setValidCookie] = useState(false);
  const [backendData, setAllData] = useState<DataType[]>([
    {
      facebook_link: '',
      google_link: '',
      helth_link: '',
      logo: '',
      name: '',
      qr_code: '',
      review_link: '',
      yel_link: '',
      unique_id: '',
      user_email: '',
      id: '',
      valid: '',
      custom_url: '',
      custom_phato_url: '',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [customeURLValue, setCustomeURLValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(false);
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );
  const { error } = useSelector(selectProperties);
  const deleteHandeler = id => {
    const token = localStorage.getItem('UserToken');
    axios
      .delete(`${USER_UPDATE_SHORTCUT}/${id}`, {
        headers: {
          token: token,
        },
      })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          return res.msg[0].data
            ? setAllData([
                {
                  facebook_link: '',
                  google_link: '',
                  helth_link: '',
                  logo: '',
                  name: '',
                  qr_code: '',
                  review_link: '',
                  yel_link: '',
                  unique_id: '',
                  user_email: '',
                  id: '',
                  valid: '',
                  custom_url: '',
                  custom_phato_url: '',
                },
              ])
            : message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          setAllData(res.msg[0]);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  };

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      custome_url: '',
      name: name,
    },
    validationSchema: Yup.object({
      custome_url: Yup.string(),
    }),
    onSubmit: (values: any, { resetForm }) => {
      const data = { ...values, imageURL };

      const token = localStorage.getItem('UserToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      };
      axios.put(USER_UPDATE_SHORTCUT, data, config).then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          setAllData(res.msg[0]);
          resetForm();
          setLoading(false);
          setImageUrl('');
          setImageURL('');
          setOpen(false);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios
      .get(USER_UPDATE_SHORTCUT, { headers: { token, LINK, AVATER_IMAGE_URL } })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res?.msg?.msg);
        }
        if (res?.msg?.name === 'success') {
          setAllData(res.msg[0]);
          return;
        }

        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  }, []);

  const downloadQRCode = () => {
    const canvas = document
      .getElementById('myqrcode')
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

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
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

  const showDrawer = name => {
    setName(name);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const downloadImage = (url, filename) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'downloaded-image';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  const downloadQRCode_2 = imageUrl => {
    downloadImage(imageUrl, 'custom-image.jpg');
  };
  console.log(backendData);
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (_, code) => {
        return (
          <Avatar
            src={
              <img
                alt="logo"
                src={`${AVATER_IMAGE_URL + 'api/photos/' + code.logo}`}
              />
            }
          />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Google Link',
      dataIndex: 'google_link',
      key: 'google_link',
    },
    {
      title: 'Facebook Link',
      dataIndex: 'facebook_link',
      key: 'facebook_link',
    },
    {
      title: 'healthgrades Link',
      dataIndex: 'helth_link',
      key: 'helth_link',
    },
    {
      title: 'Yelp Link',
      dataIndex: 'yel_link',
      key: 'yel_link',
    },
    {
      title: 'Review Link',
      dataIndex: 'review_link',
      key: 'review_link',
      render: (_, code) => {
        return (
          <a target="_blank" href={LINK + 'review/shortcut/' + code.unique_id}>
            Review Link
          </a>
        );
      },
    },
    {
      title: 'Custom Link',
      dataIndex: 'custom_url',
      key: 'custom_url',
      render: (_, code) => {
        return (
          <>
            {code.custom_url === " " ? (
              <p>Add Custom Link</p>
            ) : (
              <a target="_blank" href={code.custom_url}>
                Review Link
              </a>
            )}
          </>
        );
      },
    },
    {
      title: 'QR code',
      dataIndex: 'qr_code',
      key: 'qr_code',
      render: (_, code) => {
        const content = (
          <div id="myqrcode">
            <QRCode
              value={LINK + 'review/shortcut/' + code.unique_id}
              status="active"
            />
            <Button
              className="mt-4 m-auto d-block"
              type="primary"
              onClick={downloadQRCode}
            >
              Download
            </Button>
          </div>
        );
        return (
          <Popover content={content}>
            <Button danger>Hover me</Button>
          </Popover>
        );
      },
    },
    {
      title: ' Custom QR code',
      dataIndex: 'custom_phato_url',
      key: 'custom_phato_url',
      render: (_, code) => {
        const url: string = `${AVATER_IMAGE_URL}api/photos/${code.custom_phato_url}`;
        const content = (
          <div id="myqrcode">
            <img
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              src={`${AVATER_IMAGE_URL}api/photos/${code.custom_phato_url}`}
              alt=""
            />
            <Button
              className="mt-4 m-auto d-block"
              type="primary"
              onClick={() => downloadQRCode_2(url)}
            >
              Download
            </Button>
          </div>
        );
        return (
          <>
            {code.custom_phato_url === ' ' ? (
              <p>Add a custom phato</p>
            ) : (
              <Popover content={content}>
                <Button danger>Hover me</Button>
              </Popover>
            )}
          </>
        );
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="border-info"
            onClick={() => showDrawer(record.name)}
          >
            Add Custom Link & Img
          </Button>

          <Button danger onClick={() => deleteHandeler(record.unique_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      {backendData[0].name === '' ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <Table
            key={Date.now()}
            columns={columns}
            dataSource={backendData}
            scroll={{ x: 1500 }}
          />
          <Drawer title="Basic Drawer" onClose={onClose} open={open}>
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
                  <Label className="form-label">custom URL</Label>
                  <Input
                    name="custome_url"
                    className="form-control"
                    placeholder="Add Custom URL"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.custome_url || ''}
                    invalid={
                      validation.touched.custome_url &&
                      validation.errors.custome_url
                        ? true
                        : false
                    }
                  />
                  {validation.touched.custome_url &&
                  validation.errors.custome_url ? (
                    <FormFeedback type="invalid">
                      {validation.errors.custome_url}
                    </FormFeedback>
                  ) : null}
                </div>

                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={onFileChanged}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                <Button
                  htmlType="submit"
                  className="d-block m-auto w-75 fw-semibold rounded-5 text-white mt-4"
                  style={{
                    overflow: 'hidden',
                    height: '40px',
                    background: '#F6653F',
                  }}
                >
                  Update
                </Button>
              </Form>
            </Card>
          </Drawer>
        </>
      )}
    </CustomeContainer>
  );
}

export default DeleteLink;
