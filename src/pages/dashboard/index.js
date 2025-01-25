import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../../components/common';
import Sidebar from '../../components/sidebar';
import Dashboardbox from './dashboardbox';

function AdminLayout() {
  const location = useLocation(); // Get the current location object
  const currentPath = location.pathname; // Extract the current path

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Header />
        {currentPath === "/dashboard" && <Dashboardbox />}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
