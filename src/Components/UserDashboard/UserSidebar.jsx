import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdBookmark } from "react-icons/io";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { FaCalendar, FaHome, FaTachometerAlt } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import footerlogo from "../HomePage/Assets/logo.png";
import setting from "../AdminDashboard/Assets/setting.png";
import help from "../AdminDashboard/Assets/help.png";
import logout from "../AdminDashboard/Assets/logout.png";

const navItems = [
  {
    icon: <FaTachometerAlt className="w-5 h-5 text-gray-600" />,
    label: "Dashboard",
    link: "/user",
  },
  {
    icon: <FaHome className="w-5 h-5 text-gray-700" />,
    label: "Properties",
    link: "/userproperties",
  },
  {
    icon: <BsFillCreditCard2FrontFill className="w-5 h-5 text-gray-700" />,
    label: "Payments",
    link: "/payments",
  },
  {
    icon: <IoMdBookmark className="w-5 h-5 text-gray-700" />,
    label: "Saved Properties",
    link: "/savedproperties",
  },
  {
    icon: <FaCalendar className="w-5 h-5 text-gray-700" />,
    label: "Calendar",
    link: "/usercalendar",
  },
];

const footerItems = [
  {
    icon: <img src={setting} alt="Settings" className="w-5 h-5" />,
    label: "Settings",
    link: "/usersetting",
  },
  {
    icon: <img src={help} alt="Help" className="w-5 h-5" />,
    label: "Help",
    link: "/userhelp",
  },
  {
    icon: <img src={logout} alt="Logout" className="w-5 h-5" />,
    label: "Logout",
    isLogout: true,
  },
];

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white p-4 shadow-lg w-64">
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
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(({ icon, label, link }, idx) => {
            const isActive = location.pathname === link;
            return (
              <li
                key={idx}
                onClick={() => {
                  navigate(link);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer group transition duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                }`}
              >
                {icon}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Links */}
      <div className="space-y-2 pt-4">
        {footerItems.map(({ icon, label, link, isLogout }, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (isLogout) {
                handleLogout();
              } else {
                navigate(link);
                setIsOpen(false);
              }
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition duration-200 ${
              isLogout
                ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
            }`}
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 shadow bg-white">
        <img src={footerlogo} alt="Logo" className="h-10 rounded-full" />
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for large screen */}
      <div className="hidden lg:flex fixed h-screen z-10">
        <SidebarContent />
      </div>

      {/* Sidebar overlay for small screens */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="absolute left-0 top-0 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;