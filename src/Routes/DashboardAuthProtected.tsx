import React from "react";
import { Navigate } from "react-router-dom";
const AuthProtected = (props) => {

  if (!localStorage.getItem('adToken')) {
    return <Navigate to={{ pathname: '/auth/login' }} />;
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default AuthProtected;
