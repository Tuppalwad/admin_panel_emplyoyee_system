import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../../components/common';
import Sidebar from '../../components/sidebar';
import Dashboardbox from './dashboardbox';

function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 overflow-y-auto p-4">
          {currentPath === '/dashboard' && <Dashboardbox />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;