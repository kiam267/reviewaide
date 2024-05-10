import React from 'react';
import { Link } from 'react-router-dom';

//import components
import SidebarContent from './SidebarContent';



const Sidebar = (props: any) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              {/* <img src={logo} alt="" height="22" />
               */}
              <h1 className="fw-bold text-black fs-3 pt-3">
                <span className="text-gradients">AIDE</span>
              </h1>
            </span>
            {/* <span className="logo-lg">
              <img src={logoDark} alt="" height="17" />
            </span> */}
            <h1 className="fw-bold text-black fs-3 pt-3">
              <span className="text-gradients">AIDE</span>
            </h1>
          </Link>

          <Link to="/" className="p-3">
            <span className="logo-sm">
              {/* <img src={logoLightSvg} alt="" height="22" /> */}
              <h1 className="fw-bold text-black fs-3 pt-3">
                <span className="text-gradients">AIDE</span>
              </h1>
            </span>
            <span className="logo-lg">
              {/* <img src={logoLightPng} alt="" height="19" /> */}
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== 'condensed' ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
