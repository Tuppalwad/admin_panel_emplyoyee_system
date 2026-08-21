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
    <div className="px-2 mb-0.5">
      {/* Main Menu */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          transition-all duration-200
          group
          ${
            isActive(currentPath, item.paths)
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center">
          <span className="w-5 inline-flex justify-center">
            <i
              className={`fas ${item.icon} text-sm ${
                isActive(currentPath, item.paths)
                  ? 'text-white'
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}
            />
          </span>

          {isSidebarOpen && (
            <span className="ml-2.5 font-medium text-sm">
              {item.title}
            </span>
          )}
        </div>

        {isSidebarOpen && item.subNav && (
          <i
            className={`fa fa-chevron-${
              isSubNavOpen[item.key] ? 'up' : 'down'
            } text-[10px] transition-transform duration-200 ${
              isActive(currentPath, item.paths) ? 'text-white' : 'text-gray-400'
            }`}
          />
        )}
      </button>

      {/* Sub Menu */}
      {isSubNavOpen[item.key] && isSidebarOpen && (
        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-3 space-y-0.5">
          {item.subNav.map(
            (subItem) =>
              subItem?.subView?.includes(adminInfo.role) && (
                <Link
                  key={subItem.title}
                  to={subItem.path}
                  className={`
                    flex items-center
                    px-3 py-1.5 rounded-lg
                    text-sm
                    transition-all duration-200
                    ${
                      currentPath === subItem.path
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-2.5 ${
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