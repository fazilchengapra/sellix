import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import ProductModal from '../../components/admin/ProductModal';
import { useToast } from '../../context/ToastContext';
import AlertDialog from '../../components/ui/AlertDialog';

import Pagination from '../../components/ui/Pagination';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { showToast } = useToast();
  
    // Alert Dialog State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'danger',
        onConfirm: () => {},
        loading: false
    });
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleAdd = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };
  
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };
  
    const confirmDelete = (productId) => {
        setAlertConfig({
            isOpen: true,
            title: 'Delete Product',
            message: `Are you sure you want to delete this product? This action cannot be undone.`,
            variant: 'danger',
            confirmText: 'Delete',
            onConfirm: () => handleDelete(productId)
        });
    };
  
    const handleDelete = async (id) => {
          setAlertConfig(prev => ({ ...prev, loading: true }));
          try {
              await api.delete(`/products/${id}`);
              setProducts(products.filter(p => p.id !== id));
              showToast("Product deleted successfully", "success");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
              console.error(error);
              showToast("Failed to delete product", "error");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          }
    };
  
    const handleModalSubmit = async (productData) => {
        try {
            if (currentProduct) {
                const res = await api.put(`/products/${currentProduct.id}`, productData);
                setProducts(products.map(p => p.id === currentProduct.id ? res.data : p));
                showToast("Product updated successfully", "success");
            } else {
                const res = await api.post('/products', productData);
                setProducts([...products, res.data]);
                showToast("Product added successfully", "success");
            }
        } catch (error) {
            console.error(error);
            showToast("Operation failed", "error");
        }
    };
  
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          <button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
  
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
  
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                           {product.colors?.[0]?.images?.[0] && (
                             <img src={product.colors[0].images[0]} alt={product.name} className="w-full h-full object-cover" />
                           )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                  No products found matching your search.
              </div>
          ) : (
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
             />
          )}
        </div>
  
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          product={currentProduct}
        />

        <AlertDialog
            isOpen={alertConfig.isOpen}
            title={alertConfig.title}
            message={alertConfig.message}
            variant={alertConfig.variant}
            confirmText={alertConfig.confirmText}
            loading={alertConfig.loading}
            onConfirm={alertConfig.onConfirm}
            onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
        />
      </div>
    );
  };
export default AdminProducts;
