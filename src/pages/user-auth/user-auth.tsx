import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import autoRightImageOne from '../../assets/images/user-auth/business-1.jpg';
import autoRightImageTwo from '../../assets/images/user-auth/business-2.jpg';
import autoRightImageThree from '../../assets/images/user-auth/business-3.jpg';
import Logo from '../../assets/images/logo.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { TypeAnimation } from 'react-type-animation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// Import Swiper styles
import 'swiper/css';
import { Link } from 'react-router-dom';

function UserAuth({ children }: { children: React.ReactNode }) {
  const array = [autoRightImageOne, autoRightImageTwo, autoRightImageThree];
  return (
    <main>
      <div className="user-auth">
        {/* Part 01 */}
        <div
          className="p-md-1 p-lg-5 m-0"
          style={{
            background: '#fff',
            width: '100%',
          }}
        >
          <Link to="/">
            <img
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
              }}
              className="py-3  user-auto-logo"
              src="/logo.png"
              alt="LOGO"
            />
            {/* <h1 className="fw-bold text-black">
              REVIEW <span className="text-gradients">AIDE</span>
            </h1> */}
          </Link>

          <div
            className="d-flex flex-column justify-content-center align-items-center "
            style={{ minHeight: '80vh' }}
          >
            {children}
          </div>
        </div>
        {/* Part 02 */}
        <div
          className="d-none d-md-block  user-auth-right"
          style={{
            alignContent: 'center',
            background: '#FFE5B4',
          }}
        >
          <div className="pt-3 px-2">
            <div>
              <h2 className="fw-bold user-auth-right-title text-black  ">
                Grow your business by using this website. It's{' '}
                <TypeAnimation
                  sequence={[
                    'free software.',
                    1000,
                    'super lightweight.',
                    1000,
                    'smooth.',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ display: 'inline-block' }}
                  repeat={Infinity}
                />
              </h2>
              <div>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  speed={800}
                  loop={true}
                  roundLengths={true}
                  centeredSlides={true}
                  centeredSlidesBounds={false}
                  modules={[Autoplay]}
                  direction="vertical"
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  className="team-s__slider pt-5 mt-5"
                >
                  {array.map((image: any, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="user-auth-swiper-child">
                        <LazyLoadImage
                          className="py-3  "
                          alt="right-side-image"
                          src={image} // use normal <img> attributes as props
                          style={{
                            width: '300px',
                            objectFit: 'cover',
                            height: '460px',
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserAuth;
