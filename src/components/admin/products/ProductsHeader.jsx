import { Plus } from "lucide-react";

const ProductsHeader = ({ onAdd }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 mt-1">Manage your product inventory</p>
      </div>
      <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Plus size={20} />
        <span>Add Product</span>
      </button>
    </div>
  );
};

export default ProductsHeader;
