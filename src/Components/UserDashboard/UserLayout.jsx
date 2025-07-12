// Components/AdminDashboard/UserLayout.jsx
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - fixed position with higher z-index */}
      <div className="fixed h-full z-50"> {/* Increased z-index */}
        <UserSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Navbar - lower z-index than sidebar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm"> {/* Reduced z-index */}
          <UserNavbar />
        </div>
        
        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;