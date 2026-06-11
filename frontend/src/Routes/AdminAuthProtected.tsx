import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from 'Layouts/admin';
const AdminAuthProtected = props => {
  if (!localStorage.getItem('admin-token')) {
    return <Navigate to={{ pathname: '/super-admin/login' }} />;
  }
  return <AdminLayout>{props.children}</AdminLayout>;
};

export default AdminAuthProtected;
