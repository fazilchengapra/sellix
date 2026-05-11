import { Link } from 'react-router-dom';
import { LogOut, Home, Package, User } from 'lucide-react';

export const MobileMenu = ({ isOpen, user, onLogout, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200 z-40">
      <div className="px-4 py-4 space-y-4">
        <Link 
          to="/" 
          className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
        <Link 
          to="/products" 
          className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Package className="w-5 h-5" />
          <span className="font-medium">Products</span>
        </Link>

        {user ? (
          <>
            <Link 
              to="/profile" 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">My Account</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Link
              to="/login"
              className="flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              onClick={onClose}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
