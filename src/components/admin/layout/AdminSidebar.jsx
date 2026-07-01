import { Link } from "react-router-dom";
import { X, LogOut, LayoutDashboard, BarChart2, Package, Users, ShoppingCart, Headphones } from "lucide-react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard",       path: "/admin" },
    { icon: BarChart2,       label: "Sales Analytics",  path: "/admin/analytics" },
    { icon: Package,         label: "Products",          path: "/admin/products" },
    { icon: Users,           label: "Users",             path: "/admin/users" },
    { icon: ShoppingCart,    label: "Orders",            path: "/admin/orders" },
    { icon: Headphones,      label: "Support Tickets",   path: "/admin/tickets" },
];

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isActive, handleLogout }) => {
  return (
    <>
       {/* Mobile Backdrop */}
       {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}
      
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
    </>
  );
};
export default AdminSidebar;
