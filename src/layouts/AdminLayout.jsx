import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/layout/AdminSidebar";
import AdminHeader from "../components/admin/layout/AdminHeader";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isActive={isActive} 
        handleLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen bg-gray-50 flex flex-col transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
