import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Search, Bell, Menu, X, BarChart2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: BarChart2, label: "Sales Analytics", path: "/admin/analytics" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  ];

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
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sellix<span className="text-blue-600">Panel</span></h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                <X size={20} />
            </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} className={active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen bg-gray-50 flex flex-col transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 w-full max-w-md">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                <div className="relative w-full hidden sm:block">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-0 text-gray-700 text-sm placeholder-gray-400"
                     />
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                        AD
                    </div>
                </div>
            </div>
        </header>

        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
