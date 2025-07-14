import { useState, useEffect } from "react";
import PropertySidebar from "./PropertySidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import BASE_URL from "../../service/api";
import axios from "axios";

const PropertiesLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loginData = JSON.parse(sessionStorage.getItem("logindata"));
        
        if (loginData) {
          setUser({
            name: loginData.user?.name || "User",
          });

          const response = await axios.get(
            `${BASE_URL}/api/users/${loginData.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${loginData.token}`,
              },
            }
          );

          setUser({
            name: response.data.name || loginData.user.name,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Mobile header with menu button (fixed) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow fixed top-0 left-0 right-0 z-30">
        <h1 className="text-xl font-semibold">
          Hello, {user?.name?.split(' ')[0] || "User"}
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 focus:outline-none"
        >
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar (fixed) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-20">
        <PropertySidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <PropertySidebar isMobileSidebarOpen={isMobileSidebarOpen} />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Desktop Navbar (fixed) */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-10">
        <Navbar />
      </div>

      {/* Scrollable Content Area */}
      <div className={`
        flex-1 pt-16 lg:ml-64 lg:pt-0
        overflow-y-auto h-full
      `}>
        <div className="lg:pt-16 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PropertiesLayout;