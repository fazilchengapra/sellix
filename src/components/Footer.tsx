import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Sellix
            </span>
            <p className="mt-4 text-gray-600 text-sm max-w-md">
              Your trusted destination for premium products. We deliver quality, style, and exceptional service to customers worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">All Products</a></li>
              <li><a href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">Shopping Cart</a></li>
              <li><a href="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors">Wishlist</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm flex items-center">
              &copy; 2024 Sellix. Made with <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> by Muhammad.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
