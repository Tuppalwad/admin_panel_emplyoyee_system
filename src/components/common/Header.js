import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { help } from "../../redux/actions";
import { auth } from "../../services";

function Header() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => !state.sidebar.isSidebarOpen);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const res = await dispatch(auth.logout());
    if (res.code === 200) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-gray-800 py-3">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div style={{ display: "flex", alignItems: 'center' }}>

          <i className="fas fa-bars text-white" style={{ fontSize: '20px', cursor: 'pointer', marginLeft: isSidebarOpen ? "0.1rem" : "0.2rem" }}
            onClick={() => dispatch(help.toggleSidebar())}
          ></i>
        </div>

        {/* User Icon and Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-white focus:outline-none"
          >
            <i className="fas fa-user text-white text-xl mr-4"></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <ul className="py-1">
                <li>
                  <div
                    className="flex items-center p-2 text-gray-900 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/dashboard/account" className="flex items-center w-full text-gray-500">
                      <i className="fas fa-cog mr-2 text-gray-600"></i>
                      Account
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className="flex items-center p-2 text-gray-900 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/inbox" className="flex items-center w-full text-gray-500">
                      <i className="fas fa-inbox mr-2 text-gray-600"></i>
                      Inbox
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className="flex items-center p-2 text-gray-900 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/dashboard/changepass" className="flex items-center w-full text-gray-500">
                      <i className="fas fa-cog mr-2 text-gray-600"></i>
                      Change Password
                    </Link>
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 text-gray-900 hover:bg-gray-100 text-left"
                  >
                    <i className="fas fa-sign-out-alt mr-2 text-gray-600"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* Responsive hamburger menu for smaller screens */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
