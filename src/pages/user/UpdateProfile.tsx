import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Avatar, Badge } from 'antd';
//i18n
import { withTranslation } from 'react-i18next';
// Redux
import { Link } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import { createSelector } from 'reselect';

// users
import user1 from '../../../assets/images/users/avatar-1.jpg';

import { useSelector } from 'react-redux';
import { log } from 'console';
import axios from 'axios';
import CustomeContainer from 'Components/Common/CustomeContainer';

const UpdateProfile = (props: any) => {
  // Declare a new state variable, which we'll call "menu"
  // const { avater } = useUserAuth();

  const [menu, setMenu] = useState(false);

  const selectProfileProperties = createSelector(
    (state: any) => state.Avater,
    profile => ({
      name: profile.name,
    })
  );

  // const { user } = useSelector(selectProfileProperties);
  const { name } = useSelector(selectProfileProperties);

  // useEffect(() => {
  //   if (localStorage.getItem("authUser")) {
  //     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  //       const obj = JSON.parse(localStorage.getItem("authUser") || "");
  //       setUsername(obj.displayName);
  //     } else if (
  //       process.env.REACT_APP_DEFAULTAUTH === "fake" ||
  //       process.env.REACT_APP_DEFAULTAUTH === "jwt"
  //     ) {
  //       setUsername(user?.username);
  //     }
  //   }
  // }, [user]);

  return (
    // <React.Fragment>
    //   <Dropdown
    //     isOpen={menu}
    //     toggle={() => setMenu(!menu)}
    //     classNameName="d-inline-block"
    //   >
    //     <DropdownToggle
    //       classNameName="btn header-item "
    //       id="page-header-user-dropdown"
    //       tag="button"
    //     >
    //       {/* http://localhost:8080 */}
    //       <Avatar size="default">{name}</Avatar>
    //       <span classNameName="d-none d-xl-inline-block ms-2 me-1">{'admin'}</span>
    //       <i classNameName="mdi mdi-chevron-down d-none d-xl-inline-block" />
    //     </DropdownToggle>
    //     <DropdownMenu classNameName="dropdown-menu-end">
    //       <DropdownItem tag="a" href="/user/profile">
    //         <i classNameName="bx bx-user font-size-16 align-middle me-1" />
    //         {props.t('Profile')}
    //       </DropdownItem>
    //       {/*
    //       <DropdownItem tag="a" href={'/user/customer_support'}>
    //         <i classNameName="bx bx-support font-size-16 align-middle me-1" />
    //         {props.t('Support')}{' '}
    //         <Badge style={{ background: '#d9d9d9' }} count="BETA" />
    //       </DropdownItem> */}
    //       <DropdownItem tag="a" href={'/auth/profile'}>
    //         <i classNameName="bx bx-lock-open font-size-16 align-middle me-1" />
    //         {props.t('Lock screen')}
    //         <Badge style={{ background: '#d9d9d9' }} count="BETA" />
    //       </DropdownItem>

    //       <div classNameName="dropdown-divider" />
    //       <Link to="/auth/logout" classNameName="dropdown-item">
    //         <i classNameName="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
    //         <span>{props.t('Logout')}</span>
    //       </Link>
    //     </DropdownMenu>
    //   </Dropdown>
    // </React.Fragment>
    <CustomeContainer>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Accordion Item #1
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>This is the first item's accordion body.</strong> It is
              shown by default, until the collapse plugin adds the appropriate
              classNamees that we use to style each element. These classNamees
              control the overall appearance, as well as the showing and hiding
              via CSS transitions. You can modify any of this with custom CSS or
              overriding our default variables. It's also worth noting that just
              about any HTML can go within the <code>.accordion-body</code>,
              though the transition does limit overflow.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Accordion Item #2
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>This is the second item's accordion body.</strong> It is
              hidden by default, until the collapse plugin adds the appropriate
              classNamees that we use to style each element. These classNamees
              control the overall appearance, as well as the showing and hiding
              via CSS transitions. You can modify any of this with custom CSS or
              overriding our default variables. It's also worth noting that just
              about any HTML can go within the <code>.accordion-body</code>,
              though the transition does limit overflow.
            </div>
          </div>
        </div>
      </div>
    </CustomeContainer>
  );
};

export default withRouter(withTranslation()(UpdateProfile));
