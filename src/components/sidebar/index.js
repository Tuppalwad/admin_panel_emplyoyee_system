import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { capitalize } from '../../utils/utils';
import NavItem from './NavItem';
import { navItems } from './navdata';
import { avatarUrl } from '../common';
import 'core-js/stable/atob';

function Sidebar() {
  const isSidebarOpen = useSelector(
    (state) => !state.sidebar.isSidebarOpen
  );

  const [isSubNavOpen, setSubNavOpen] = useState({});

  const token = localStorage.getItem('token') || '';
  const { adminInfo } = useSelector((state) => state.admininfo);

  let decoded = {};

  try {
    decoded = token ? jwtDecode(token) : {};
  } catch (error) {
    decoded = {};
  }

  const gravatarUrl = avatarUrl({
    email: decoded?.email || '',
  });

  const toggleSubNav = (key) => {
    setSubNavOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (currentPath, paths) =>
    paths.includes(currentPath);

  return (
    <aside
      className={`bg-white border-r text-black overflow-y-auto flex-shrink-0 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
      style={{
        transition: 'width 0.2s ease',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {isSidebarOpen && (
        <div className="flex flex-col items-center mt-5 px-4">
          <img
            src={gravatarUrl}
            alt="Admin"
            className="w-20 h-20 object-cover rounded-md"
          />

          <div className="mt-4 text-center">
            <h1 className="text-lg font-semibold">
              {capitalize(decoded?.fullname || '')}
            </h1>

            <p className="text-sm text-gray-500">
              {decoded?.role}
            </p>
          </div>
        </div>
      )}

      <nav className="pt-5 pb-10">
        {navItems.map(
          (item) =>
            item.view.includes(adminInfo?.role) && (
              <NavItem
                key={item.key}
                item={item}
                isSidebarOpen={isSidebarOpen}
                toggleSubNav={toggleSubNav}
                isActive={isActive}
                isSubNavOpen={isSubNavOpen}
              />
            )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;