import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { Product } from '../types';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
        try {
            // Mock filtering: first 4 items
            const response = await api.get('/products?_limit=4');
            setFeaturedProducts(response.data);
        } catch (error) {
            console.error("Error fetching featured products", error);
        }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Featured Collection</h2>
           <Link to="/products">
              <Button variant="ghost" className="hidden sm:inline-flex">
                 View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
           {featuredProducts.map(product => (
               <ProductCard key={product.id} product={product} />
           ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
            <Link to="/products">
                <Button variant="outline" className="w-full">
                    View All Products
                </Button>
            </Link>
        </div>
      </section>

      {/* Newsletter or other sections could go here */}
    </div>
  );
};

export default Home;

