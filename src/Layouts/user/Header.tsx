import React, { useState } from 'react';

import { Link } from 'react-router-dom';

// Reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import NotificationDropDown from '../../Components/CommonForBoth/NotificationDropDown';
import ProfileMenu from '../../Components/CommonForBoth/TopBarDropDown/ProfileMenu';
import megamenuImg from '../../assets/images/megamenu-img.png';

// import images
import github from '../../assets/images/brands/github.png';
import bitbucket from '../../assets/images/brands/bitbucket.png';
import dribbble from '../../assets/images/brands/dribbble.png';
import dropbox from '../../assets/images/brands/dropbox.png';
import mail_chimp from '../../assets/images/brands/mail_chimp.png';
import slack from '../../assets/images/brands/slack.png';

import logo from '../../assets/images/logo.svg';
import logoLightSvg from '../../assets/images/logo-light.svg';

//i18n
import { useGetHeader } from 'api/userApi';
import Logout from 'pages/auth/Logout';

const Header = (props: any) => {
  const [search, setsearch] = useState(false);
  const token = localStorage.getItem('user-token');
  const { getHeaderInfo } = useGetHeader(token);

  const toggleFullscreen = () => {
    let document: any = window.document;
    document.body.classList.add('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
    // handle fullscreen exit
    const exitHandler = () => {
      if (
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      )
        document.body.classList.remove('fullscreen-enable');
    };
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
  };

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
  }

  if (getHeaderInfo?.tokenInvalid) {
    return <Logout />;
  }



  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => tToggle()}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => setsearch(!search)}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? 'dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show'
                    : 'dropdown-menu dropdown-menu-lg dropdown-menu-end p-0'
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            <ProfileMenu userName={getHeaderInfo?.data?.userName} />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
