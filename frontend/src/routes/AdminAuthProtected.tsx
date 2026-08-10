import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/admin';
const AdminAuthProtected = props => {
  if (!localStorage.getItem('authorization')) {
    return (
      <Navigate to={{ pathname: '/super-admin/login' }} />
    );
  }
  return <AdminLayout>{props.children}</AdminLayout>;
};

export default AdminAuthProtected;
