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

const ProfileMenu = (props: any) => {
  const [menu, setMenu] = useState(false);
  const selectProfileProperties = createSelector(
    (state: any) => state.Avater,
    profile => ({
      name: profile.name,
    })
  );

  const { name } = useSelector(selectProfileProperties);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <Avatar
            size="default"
            src={
              <img
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=5`}
                alt="avatar"
                style={{ objectFit: 'cover' }}
              />
            }
          >
            Admin
          </Avatar>
          <span className="d-none d-xl-inline-block ms-2 me-1">Admin</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <DropdownItem tag="a" href="/user/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t('Profile')}
          </DropdownItem> */}

          {/* <DropdownItem tag="a" href={'/user/customer_support'}>
            <i className="bx bx-support font-size-16 align-middle me-1" />
            {props.t('Support')}{' '}
            <Badge style={{ background: '#d9d9d9' }} count="BETA" />
          </DropdownItem> */}
          {/* <DropdownItem tag="a" href={'/user/profile'}>
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t('Lock screen')}
            <Badge style={{ background: '#d9d9d9' }} count="BETA" />
          </DropdownItem> */}

          <div className="dropdown-divider" />
          <Link to="/super-admin/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t('Logout')}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(ProfileMenu));
