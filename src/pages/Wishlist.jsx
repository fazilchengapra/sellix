import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
        <div className="min-h-[calc(100vh-4rem)] pt-8 pb-12">
            <EmptyState 
                icon={Heart} 
                title="Your wishlist is empty" 
                description="Save items you love to your wishlist. Review them anytime and easily move them to the cart."
                actionLabel="Start Shopping"
                actionLink="/products"
            />
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <Card key={item.id} className="group relative">
             <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.productName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-4">
               <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
               <p className="text-gray-500 text-sm mt-1 mb-4">{formatPrice(item.price)}</p>
               
               <Button 
                className="w-full" 
                onClick={() => {
                   addToCart({ 
                     productId: item.productId, 
                     productName: item.productName, 
                     price: item.price, 
                     image: item.image, 
                     quantity: 1 
                   });
                   removeFromWishlist(item.id);
                }}
               >
                 <ShoppingCart className="w-4 h-4 mr-2" />
                 Move to Cart
               </Button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
