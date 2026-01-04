import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, LogOut, Menu, X, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { MobileMenu } from "./navbar/MobileMenu";
import { NavIconLink } from "./navbar/NavIconLink";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Sellix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Products
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Orders
              </Link>
            )}
            
            <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
              {user ? (
                <>
                  <NavIconLink to="/wishlist" icon={Heart} count={wishlist.length} label="Wishlist" />
                  <NavIconLink to="/cart" icon={ShoppingCart} count={cart.length} label="Cart" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
             {user && (
                <>
                   <NavIconLink to="/wishlist" icon={Heart} count={wishlist.length} label="Wishlist" />
                   <NavIconLink to="/cart" icon={ShoppingCart} count={cart.length} label="Cart" />
                </>
             )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          user={user}
          onClose={closeMenu}
          onLogout={handleLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;
