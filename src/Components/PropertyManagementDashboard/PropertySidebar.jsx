import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";
import footerlogo from "../HomePage/Assets/logo.png";

const PropertySidebar = ({ isMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed lg:static h-screen w-64 bg-white shadow-md flex flex-col z-30 transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Main container with flex column and full height */}
      <div className="flex flex-col h-full p-4">
        {/* Logo Section */}
        <div className="flex items-center mb-8 pl-2">
          <Link to="/">
            <img
              src={footerlogo}
              alt="Footer Logo"
              className="h-14 w-auto rounded-full shadow-lg hover:scale-110 transition duration-300"
              style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.15)" }}
            />
          </Link>
        </div>

        {/* Navigation Links - flex-1 allows this to grow and push footer down */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3">
            <li>
              <Link
                to="/properties"
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isActive("/properties")
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <FaTachometerAlt className="w-5 h-5 mr-3 text-gray-600" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/propertypage"
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isActive("/propertypage")
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <FaBuilding className="w-5 h-5 mr-3 text-gray-600" />
                Properties
              </Link>
            </li>
            <li>
              <Link
                to="/propertyleads"
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isActive("/propertyleads")
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <FaUserTie className="w-5 h-5 mr-3 text-gray-600" />
                Lead Management
              </Link>
            </li>
            <li>
              <Link
                to="/propertycalendar"
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isActive("/propertycalendar")
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <FaCalendarAlt className="w-5 h-5 mr-3 text-gray-600" />
                Calendar
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer Links - mt-auto pushes this to the bottom */}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            to="/propertysetting"
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              isActive("/propertysetting")
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <FaCogs className="w-5 h-5 mr-3 text-gray-600" />
            Settings
          </Link>
          <Link
            to="/propertyhelp"
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              isActive("/propertyhelp")
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <FaQuestionCircle className="w-5 h-5 mr-3 text-gray-600" />
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 rounded-lg transition text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySidebar;