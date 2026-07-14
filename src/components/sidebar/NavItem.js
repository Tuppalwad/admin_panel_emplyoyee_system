import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavItem = ({
  item,
  isSidebarOpen,
  toggleSubNav,
  isActive,
  isSubNavOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { adminInfo } = useSelector((state) => state.admininfo);

  const handleClick = () => {
    if (!item.subNav) {
      navigate(item.paths[0]);
    } else {
      toggleSubNav(item.key);
      navigate(item.subNav[0].path);
    }
  };

  return (
    <div className="px-3 mb-1">
      {/* Main Menu */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-xl
          transition-all duration-200
          group
          ${
            isActive(currentPath, item.paths)
              ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center">
          <i
            className={`fas ${item.icon} text-lg ${
              isActive(currentPath, item.paths)
                ? 'text-blue-600'
                : 'text-gray-500 group-hover:text-gray-700'
            }`}
          />

          {isSidebarOpen && (
            <span className="ml-3 font-medium text-sm">
              {item.title}
            </span>
          )}
        </div>

        {isSidebarOpen && item.subNav && (
          <i
            className={`fa fa-chevron-${
              isSubNavOpen[item.key] ? 'up' : 'down'
            } text-xs transition-transform duration-200`}
          />
        )}
      </button>

      {/* Sub Menu */}
      {isSubNavOpen[item.key] && isSidebarOpen && (
        <div className="ml-5 mt-2 border-l-2 border-gray-200 pl-3 space-y-1">
          {item.subNav.map(
            (subItem) =>
              subItem?.subView?.includes(adminInfo.role) && (
                <Link
                  key={subItem.title}
                  to={subItem.path}
                  className={`
                    flex items-center
                    px-3 py-2 rounded-lg
                    text-sm
                    transition-all duration-200
                    ${
                      currentPath === subItem.path
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-3 ${
                      currentPath === subItem.path
                        ? 'bg-blue-600'
                        : 'bg-gray-400'
                    }`}
                  />

                  {subItem.title}
                </Link>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default NavItem;