import { Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CLIENT_VISITOR_UNSUBSCRIBE } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';
function Unsubscribe() {
  const { id } = useParams();
  const [validCookie, setValidCookie] = useState(false);
  const [isUnsubscribe, setIsUnsubscribe] = useState(false);
  const [show, setShow] = useState(true);

  const unHendelClick = (id, isUnsubscribe) => {
    const token = localStorage.getItem('UserToken');
    axios
      .put(
        CLIENT_VISITOR_UNSUBSCRIBE,
        {
          id,
          isUnsubscribe,
        },
        {
          headers: {
            token,
          },
        }
      )
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          message.success('error', res.msg.msg);
          return;
        }
        if (res?.msg?.name === 'success') {
          setShow(pre => !pre);
          return;
        }
        if (res.msg.name === 'auth') {
          return setValidCookie(true);
        }
      });
  };
  if (validCookie) {
    return <Logout />;
  }
  return (
    <section className="d-flex justify-content-center pt-5">
      <div>
        <Card className="p-5 d-block rounded-5">
          <div>
            <video
              autoPlay
              muted
              loop
              style={{ minWidth: '400' }}
              height="300"
              className="d-block m-auto"
            >
              <source
                src="https://cdn.dribbble.com/users/2417352/screenshots/14919678/media/4bca6585cbd431e0ce29dfd8d5853e9c.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <Space className="d-block">
            <div>
              <p className="text-gray fs-5">
                We're sorry to see you go. If you'd like to unsubscribe, click
                the link below.
              </p>
            </div>
            <div className="d-flex justify-content-center ">
              <Button
                onClick={() => {
                  unHendelClick(id, isUnsubscribe);
                  setIsUnsubscribe(pre => !pre);
                }}
                style={{ background: '#F6653F', height: '60px' }}
                className="text-white fw-semibold rounded-5 px-4 py-2 fs-5"
              >
                {show ? ' Unsubscribe' : ' Subscribe'}
              </Button>
            </div>
          </Space>
        </Card>
      </div>
    </section>
  );
}

export default Unsubscribe;
