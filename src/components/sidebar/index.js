// Sidebar.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../asset/logo.png';
import { jwtDecode } from "jwt-decode";
import { capitalize } from '../../utils/utils';
import NavItem from './NavItem';
import { navItems } from './navdata';
import { avatarUrl } from '../common';
import "core-js/stable/atob";


function Sidebar() {
  const isSidebarOpen = useSelector((state) => !state.sidebar.isSidebarOpen);
  const [isSubNavOpen, setSubNavOpen] = useState({});

  const token = localStorage.getItem('token') || "";
  // const {adminInfo} = useSelector(state=> state.adminInfos)
  const { adminInfo } = useSelector((state) => state.admininfo)

  console.log(token, 'kkkkkkkkkkkkkkkk')
  const decoded = jwtDecode(token ? token : "");
  const gravatarUrl = avatarUrl({ email: decoded?.email });

  const toggleSubNav = (key) => {
    setSubNavOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (currentPath, paths) => paths.includes(currentPath);

  return (
    <div className={`h-screen bg-white text-black ${isSidebarOpen ? 'w-64' : 'w-15'}`}
      style={{
        transition: 'width 0.2s',
        height: '100vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <Link to="/" className="text-3xl font-bold text-white flex items-center ps-3 pt-2">
        <img src={logo} alt="Logo" className="w-10 h-10 object-cover bg-white rounded-full" />
        <p className="ms-3" style={{
          display: isSidebarOpen ? 'block' : 'none',
          color: "#000",
          fontSize: '1.5rem',
          fontFamily: 'cursive',
          fontWeight: 'bold'
        }}> MindNerves 
        </p>
      </Link>

      {isSidebarOpen && (
        <div className="flex items-center mx-auto mt-5"
          style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <img
            src={gravatarUrl}
            alt="Admin"
            className="w-18 h-20 object-cover rounded-sm"
          />
          <div className="mt-4 text-center">
            <h1 className="text-lg font-semibold">{decoded && capitalize(decoded?.fullname)}</h1>
            <p className="text-sm text-gray-500">{decoded && decoded?.role}</p>
          </div>
        </div>
      )}

      <nav className='pt-5'>
        {navItems.map((item) => (
          item.view.includes(adminInfo.role) && <NavItem
            key={item.key}
            item={item}
            isSidebarOpen={isSidebarOpen}
            toggleSubNav={toggleSubNav}
            isActive={isActive}
            isSubNavOpen={isSubNavOpen}
          />
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
