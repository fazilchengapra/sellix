import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const AdminHeader = ({ setSidebarOpen }) => {
    const {user} = useAuth()
  return (
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
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium uppercase">
                    {user?.name?.trim()?.slice(0, 2)}
                </div>
            </div>
        </div>
    </header>
  );
};
export default AdminHeader;
