import React from 'react';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar userType="admin" />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;