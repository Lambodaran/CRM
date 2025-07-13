import { useState, useEffect } from "react";
import PropertySidebar from "./PropertySidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const PropertiesLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Using lg breakpoint (1024px)
      // Close sidebar on mobile when resizing to larger screens
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile header with menu button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 focus:outline-none"
        >
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - controlled by PropertiesLayout */}
      <PropertySidebar isMobileSidebarOpen={isMobileSidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {isMobileSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <div
        className={`flex-1 overflow-y-auto min-h-screen p-4 transition-all duration-300 
          ${!isMobileSidebarOpen ? "ml-0" : "ml-0 lg:ml-64"}`}
      >
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default PropertiesLayout;