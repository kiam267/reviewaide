import React, { useEffect, useState } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import CustomeContainer from 'Components/Common/CustomeContainer';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Card, QRCode, message, Button } from 'antd';
import Logout from 'pages/auth/Logout';
import { Alert, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import {
  QRCODE_GEN_VISITOR,
  QRCODE_GEN_VISITOR_CREATE,
  USER_MARKETING_STORE,
  LINK,
  QRCODE_GEN_VISITOR_DELETE,
} from '../../helpers/url_helper';

function QRcode() {
  const [validCookie, setValidCookie] = useState(false);
  const [QRcodeValue, setQRcodeValue] = useState('fgdgdfg');
  const [QRcodeStatus, setQRcodeStatus] = useState<'active' | 'loading'>(
    'loading'
  );
  const [beforeCreateQRcode, setBeforeCreateQRcode] = useState<boolean>(false);
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

   console.log(beforeCreateQRcode);
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios.get(QRCODE_GEN_VISITOR, { headers: { token, LINK } }).then(resp => {
      const res = resp.data;
      if (res?.msg?.name === 'error') {
        message.error(res.msg.msg);
        return;
      }
      if (res?.msg?.name === 'success') {
        console.log(res);
        
        setQRcodeStatus(res.msg.msg.valid ? 'active' : 'loading');
        setBeforeCreateQRcode(res.msg.msg.valid);
        setQRcodeValue(res.msg.msg.id);
        return;
      }
      if (res.msg.name === 'auth') {
        return setValidCookie(true);
      }
    });
  }, []);
  const genQRcode = () => {
    const token = localStorage.getItem('UserToken');
    axios
      .post(QRCODE_GEN_VISITOR_CREATE, { token, LINK }, { headers: { token } })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res.msg.msg);
          return;
        }
        if (res?.msg?.name === 'success') {
          setQRcodeStatus('active');
          setBeforeCreateQRcode(res.msg.msg.valid);
          setQRcodeValue(res.msg.msg.id);
          return;
        }
        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  };

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
  const QRCodeDeleteButton = () => {
    const token = localStorage.getItem('UserToken');
    axios
      .delete(QRCODE_GEN_VISITOR_DELETE, {
        headers: {
          token: token,
        },
        data: { LINK: LINK }, // Use 'data' to send data in a DELETE request
      })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.error(res.msg.msg);
        } else if (res?.msg?.name === 'success') {
           setQRcodeStatus('loading');
           setBeforeCreateQRcode(res.msg.msg.valid);
           setQRcodeValue(res.msg.msg.id);
        } else if (res?.msg?.name === 'auth') {
          setValidCookie(true);
        }
      });
  };

  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Row className="justify-content-center">
        <Col sm={12} lg={6}>
          <Card className="my-4 d-flex justify-content-center rounded-5">
            <div id="myqrcode">
              <QRCode
                status={QRcodeStatus}
                value={QRcodeValue}
                bgColor="#fff"
                style={{ marginBottom: 16 }}
              />
              <div className="gap-3 d-flex justify-content-center">
                <Button
                  type="primary"
                  className="m-auto d-block"
                  onClick={downloadQRCode}
                  disabled={QRcodeStatus === 'loading' && true}
                >
                  Download
                </Button>
                <Button
                  type="primary"
                  className={`m-auto ${
                    beforeCreateQRcode ? 'd-none' : 'd-block '
                  }`}
                  onClick={genQRcode}
                >
                  Create
                </Button>
                <Button
                  type="primary"
                  danger
                  className={`m-auto  ${
                    beforeCreateQRcode ? 'd-block' : 'd-none '
                  }`}
                  onClick={QRCodeDeleteButton}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </CustomeContainer>
  );
}

export default QRcode;
