import React from 'react';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

const CandidateDashboard = () => {
  return (
    <div className="flex">
      <Sidebar userType="candidate" />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default CandidateDashboard;