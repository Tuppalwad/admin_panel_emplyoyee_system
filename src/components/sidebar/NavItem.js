// NavItem.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavItem = ({ item, isSidebarOpen, toggleSubNav, isActive, isSubNavOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const handleClick = () => {
    if (item.paths.length == 1) {
      navigate(item.paths[0])
      return
    }
    if (item.subNav) {
      toggleSubNav(item.key);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={`flex items-center p-3 text-base font-normal ${isActive(currentPath, item.paths) ? 'text-blue-900' : 'text-gray-900'} hover:bg-gray-300`}
      >
        <i className={`fas ${item.icon} mr-3 ps-2 ${isActive(currentPath, item.paths) ? 'text-blue-900' : 'text-gray-900'}`}></i>
        {isSidebarOpen && (
          <div className="flex justify-between w-full">
            <span>{item.title}</span>
            {item.subNav && (
              <i className={`fa fa-chevron-${isSubNavOpen[item.key] ? 'up' : 'down'} mt-2 pr-2`}></i>
            )}
          </div>
        )}
      </button>
      {isSubNavOpen[item.key] && isSidebarOpen && item.subNav && (
        <div className={`pl-${isSidebarOpen ? 8 : 0}`}>
          {item.subNav.map((subItem) => (
            <Link
              to={subItem.path}
              key={subItem.title}
              className={`flex items-center p-3 text-base font-normal ${isActive(currentPath, [subItem.path]) ? 'text-blue-900' : 'text-gray-900'} hover:bg-gray-300`}
            >
              <i className={`fa fa-chevron-right pr-2 ${isActive(currentPath, [subItem.path]) ? 'text-blue-900' : 'text-gray-900'}`}></i>
              {isSidebarOpen && subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
