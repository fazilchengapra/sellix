import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceSort, setPriceSort] = useState('default');

  const [categories, setCategories] = useState(['All']);
  const [brands, setBrands] = useState(['All']);

  // Fetch initial data to populate filter options
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const response = await api.get('/products/');
        const allProds = response.data;
        setCategories(['All', ...new Set(allProds.map(p => p.category).filter(Boolean))]);
        setBrands(['All', ...new Set(allProds.map(p => p.brand).filter(Boolean))]);
      } catch (error) {
        console.error("Error fetching initial products for filters", error);
      }
    };
    fetchInitialOptions();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedBrand !== 'All') params.brand = selectedBrand;
        if (priceSort !== 'default') params.sort = priceSort;

        const response = await api.get('/products/', { params });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, selectedBrand, priceSort]);

  if (loading && products.length === 0) return <div className="min-h-screen flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500 mt-2">Explore our collection of premium items</p>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
          {/* Filters */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white text-gray-700 cursor-pointer w-full sm:w-40"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white text-gray-700 cursor-pointer w-full sm:w-40"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
              ))}
            </select>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white text-gray-700 cursor-pointer col-span-2 sm:w-48 sm:col-auto"
            >
              <option value="default">Sort by</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>

          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      <div className="mb-4 text-sm text-gray-500 font-medium">
        {products.length} Items Found
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search terms</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedBrand('All');
              setPriceSort('default');
            }}
            className="mt-4 text-black hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
