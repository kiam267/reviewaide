import React, { useEffect, useState } from 'react';
import CustomeContainer from 'Components/Common/CustomeContainer';

import { Card, QRCode, Button } from 'antd';
import Logout from 'pages/auth/Logout';
import { Row, Col } from 'reactstrap';
import {
  useDeleteClientLink,
  useGetClientLink,
  useReviewLink,
} from 'api/clientApi';

import { REVIEW_LINK } from '../../helpers/url_helper';
function QRcode() {
  const token: string | null = localStorage.getItem('user-token');
  const { createQRCode, isSuccess } = useReviewLink();
  //@ts-ignore
  const { getClientLinkInfo, refetch } = useGetClientLink(token);
  const { createClient, isSuccess: isDeleteSuccess } = useDeleteClientLink();

  useEffect(() => {
    refetch();
  }, [isSuccess, isDeleteSuccess]);

  const [QRcodeLink, setQRcodeLink] = useState('');
  const [QRcodeStatus, setQRcodeStatus] = useState<'active' | 'loading'>(
    'loading'
  );
  const [beforeCreateQRcode, setBeforeCreateQRcode] = useState<boolean>(false);

  const genQRcode = async () => {
    const randomNumber: string = (
      Math.floor(Math.random() * 90000) + 10000
    ).toString();

    console.log(randomNumber);

    //@ts-ignore
    await createQRCode({ token, uniqueId: randomNumber });
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
  const QRCodeDeleteButton = async () => {
    //@ts-ignore
    await createClient({ token, uniqueId: getClientLinkInfo?.data?.uniqueId });
  };

  useEffect(() => {
    setQRcodeLink(
      `${REVIEW_LINK}/review/shortcut/${getClientLinkInfo?.data?.uniqueId}`
    );
    setBeforeCreateQRcode(!!getClientLinkInfo?.data?.uniqueId);
    setQRcodeStatus(getClientLinkInfo?.data?.uniqueId ? 'active' : 'loading');
  }, [getClientLinkInfo?.data]);

  if (getClientLinkInfo?.tokenInvalid) {
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
                value={QRcodeLink}
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
