import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/common';
import Sidebar from '../../components/sidebar';

function AdminLayout() {

  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100">
          <Header />
          <Outlet />
        </div>
      </div>
  );
}

export default AdminLayout;
