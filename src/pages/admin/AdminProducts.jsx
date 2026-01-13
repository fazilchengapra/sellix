import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import ProductModal from '../../components/admin/ProductModal';
import { useToast } from '../../context/ToastContext';
import AlertDialog from '../../components/ui/AlertDialog';
import Pagination from '../../components/ui/Pagination';
import ProductsHeader from '../../components/admin/products/ProductsHeader';
import ProductsToolbar from '../../components/admin/products/ProductsToolbar';
import ProductsTable from '../../components/admin/products/ProductsTable';

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
        <ProductsHeader onAdd={handleAdd} />
  
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <ProductsToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  
          <ProductsTable 
              products={currentProducts}
              onEdit={handleEdit}
              onDelete={confirmDelete} 
          />
          
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
