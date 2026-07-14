import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { help } from "../../redux/actions";
import { auth } from "../../services";
import logo from '../../asset/logo.png';
import { getAdmininfo } from "../../redux/actions/adminAction";
import { jwtDecode } from "jwt-decode";

function Header() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => !state.sidebar.isSidebarOpen);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem('token') || '';

  const decode = jwtDecode(token);
  const [adminInfo, setAdminInfo] = useState({});
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {

    try {
      setLoading(true);
      const res = await dispatch(auth.logout());
      if (res.code === 200) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch admin details from backend
    const fetchAdmin = async () => {
      const res = await dispatch(getAdmininfo(decode?.email));

      console.log(res);
      if (res?.code === 200) {
        setAdminInfo(res?.data);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 h-16 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(help.toggleSidebar())}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
          >
            <i className="fas fa-bars text-gray-600"></i>
          </button>

          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-sm"
            />

            <div>
              <h1 className="font-bold text-gray-800 text-lg">
                MindNerves
              </h1>
              <p className="text-xs text-gray-500">
                Employee Management
              </p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Search */}
          {/* <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72">
        <i className="fas fa-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div> */}

          {/* Notification */}
          <button className="relative w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <i className="fas fa-bell text-gray-600"></i>

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {adminInfo?.fullname?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <i className="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">
                    {adminInfo?.fullname || 'Admin User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {adminInfo?.email || 'admin@mindnerves.com'}
                  </p>
                </div>

                <Link
                  to="/dashboard/account"
                  className="flex items-center px-4 py-3 hover:bg-gray-50"
                >
                  <i className="fas fa-user mr-3 text-gray-500"></i>
                  My Profile
                </Link>

                <Link
                  to="/dashboard/changepass"
                  className="flex items-center px-4 py-3 hover:bg-gray-50"
                >
                  <i className="fas fa-lock mr-3 text-gray-500"></i>
                  Change Password
                </Link>

                <Link
                  to="/inbox"
                  className="flex items-center px-4 py-3 hover:bg-gray-50"
                >
                  <i className="fas fa-envelope mr-3 text-gray-500"></i>
                  Inbox
                </Link>

                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    {loading ? 'Logging out...' : 'Logout'} 
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Header;
