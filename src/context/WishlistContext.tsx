import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { WishlistItem } from '../types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Partial<WishlistItem> & { productId: string }) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
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
      const response = await api.get(`/wishlist?userId=${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const addToWishlist = async (item: Partial<WishlistItem> & { productId: string }) => {
    if (!user) return;
    
    if (isInWishlist(item.productId)) {
        return; 
    }

    try {
      const newItem = { ...item, userId: user.id };
      const response = await api.post('/wishlist', newItem);
      setWishlist(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding to wishlist", error);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const isInWishlist = (productId: string) => {
      return wishlist.some(item => item.productId === productId);
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

