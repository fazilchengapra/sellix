import { useNavigate } from 'react-router-dom';
import { Trash2, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();
  
    if (wishlist.length === 0) {
      return (
        
          
             
          
          Your wishlist is empty
          Save items you want to buy later here.
           navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Start Browse
          
        
      );
    }
  
    return (
       (
                 removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove"
                    >
                        
                    
                  
                  
                  {item.productName}
                  ₹{item.price}
  
                   navigate(`/product/${item.productId}`)}
                     className="mt-auto w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                      
                      View Product
                  
                
              ))}
          
        
      
    );
  };
  
export default Wishlist;
