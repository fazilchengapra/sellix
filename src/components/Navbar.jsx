import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, LogOut, Menu, X, Package, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { MobileMenu } from "./navbar/MobileMenu";
import { NavIconLink } from "./navbar/NavIconLink";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, resetCart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(resetCart);
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-base font-medium transition-colors relative py-1 ${isActive
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
      : "text-gray-700 hover:text-blue-600"
      }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={closeMenu}
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Sellix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getNavLinkClass("/")}>
              Home
            </Link>
            <Link to="/products" className={getNavLinkClass("/products")}>
              Products
            </Link>
            {!user && <NavIconLink
              to="/cart"
              icon={ShoppingCart}
              count={cart.length}
              label="Cart"
            />}

            {user && (
              <Link to="/orders" className={getNavLinkClass("/orders")}>
                Orders
              </Link>
            )}

            <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
              {user ? (
                <>
                  <NavIconLink
                    to="/wishlist"
                    icon={Heart}
                    count={wishlist.length}
                    label="Wishlist"
                  />
                  <NavIconLink
                    to="/cart"
                    icon={ShoppingCart}
                    count={cart.length}
                    label="Cart"
                  />
                  <Link
                    to="/profile"
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold hover:shadow-lg hover:shadow-blue-600/20 transition-all"
                    title="Profile"
                  >
                    {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
                  </Link>
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
                <NavIconLink
                  to="/wishlist"
                  icon={Heart}
                  count={wishlist.length}
                  label="Wishlist"
                />
                <NavIconLink
                  to="/cart"
                  icon={ShoppingCart}
                  count={cart.length}
                  label="Cart"
                />
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
