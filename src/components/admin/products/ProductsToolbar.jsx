import { Search } from "lucide-react";

const ProductsToolbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default ProductsToolbar;
