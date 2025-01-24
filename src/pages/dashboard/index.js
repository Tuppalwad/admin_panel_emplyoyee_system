import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/common';
import Sidebar from '../../components/sidebar';
import Dashboardbox from './dashboardbox';

function AdminLayout() {
  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100">
          <Header />
          {/* <Dashboardbox/> */}
          <Outlet />
        </div>
      </div>
  );
}

export default AdminLayout;
