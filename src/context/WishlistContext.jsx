import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
        setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
     if (!user) return;
    try {
      const response = await api.get(`/wishlist/`);
      const data = response.data?.items || [];
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const addToWishlist = async (item) => {
    if (!user) return;
    
    const productId = item.productId || item;
    
    if (isInWishlist(productId)) {
        return; 
    }

    try {
      const response = await api.post('/wishlist/', { product_id: productId });
      setWishlist(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding to wishlist", error);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}/`);
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const isInWishlist = (productId) => {
      if (!Array.isArray(wishlist)) return false;
      return wishlist.some(item => item.product?.id === productId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
