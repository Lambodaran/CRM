




import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdBookmark } from "react-icons/io";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { FaCalendar } from "react-icons/fa";
import { FaHome } from "react-icons/fa"; // Place this at the top with other imports
import { FaTachometerAlt } from "react-icons/fa";
import footerlogo from "../HomePage/Assets/logo.png";


import sidebar1 from "../AdminDashboard/Assets/sidebar1.png"; // Dashboard
import sidebar2 from "../AdminDashboard/Assets/sidebar2.png"; // Properties
import sidebar3 from "../AdminDashboard/Assets/sidebar3.png"; // Saved
import sidebar4 from "../AdminDashboard/Assets/sidebar4.png"; // Payments (reused here)
import sidebar6 from "../AdminDashboard/Assets/sidebar6.png"; // Calendar
import setting from "../AdminDashboard/Assets/setting.png";
import help from "../AdminDashboard/Assets/help.png";
import logout from "../AdminDashboard/Assets/logout.png";
import sidebarlogo from "../AdminDashboard/Assets/sidebarlogo.png";

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-500 font-medium bg-blue-100 rounded-lg px-2 py-1"
      : "text-gray-700 hover:text-blue-500";

  const handleLogout = () => {
    // Clear auth data if stored in localStorage/sessionStorage
    sessionStorage.clear();

    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="hidden h-screen lg:flex w-64 bg-white shadow-md flex-col p-4">
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

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-6">
          <li>
            <Link
              to="/user"
              className={`flex items-center ${isActive("/user")}`}
            >
              <FaTachometerAlt className="w-5 h-5 mr-3 text-gray-600" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/userproperties"
              className={`flex items-center ${isActive("/userproperties")}`}
            >
              <FaHome className="w-5 h-5 mr-3 text-gray-700" />
              Properties
            </Link>
          </li>

          <li>
            <Link
              to="/payments"
              className={`flex items-center ${isActive("/payments")}`}
            >
              <BsFillCreditCard2FrontFill className="w-5 h-5 mr-3 text-gray-700" />
              Payments
            </Link>
          </li>

          <li>
            <Link
              to="/savedproperties"
              className={`flex items-center ${isActive("/savedproperties")}`}
            >
              <IoMdBookmark className="w-5 h-5 mr-3 text-gray-700" />
              Saved Properties
            </Link>
          </li>

          <li>
            <Link
              to="/usercalendar"
              className={`flex items-center ${isActive("/usercalendar")}`}
            >
              <FaCalendar className="w-5 h-5 mr-3 text-gray-700" />
              Calendar
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer Links */}
      <div className="mt-auto space-y-6">
        <Link
          to="/usersetting"
          className={`flex items-center ${isActive("/settings")}`}
        >
          <img src={setting} alt="Settings" className="w-5 h-5 mr-3" />
          Settings
        </Link>

        <Link to="/userhelp" className={`flex items-center ${isActive("/help")}`}>
          <img src={help} alt="Help" className="w-5 h-5 mr-3" />
          Help
        </Link>

        <div
          onClick={handleLogout}
          className="flex items-center text-red-500 hover:text-red-700 cursor-pointer"
        >
          <img src={logout} alt="Logout" className="w-5 h-5 mr-3" />
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;


