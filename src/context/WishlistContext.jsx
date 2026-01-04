import React, { createContext, useState, useContext, useEffect } from 'react';
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
  }, []);

  const fetchWishlist = async () => {
     if (!user) return;
    try {
      const response = await api.get(`/wishlist?userId=${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const addToWishlist = async (item) => {
    if (!user) return;
    
    if (isInWishlist(item.productId)) {
        // Optional: toggle remove if already in wishlist? 
        // For now, let's just assume add. Or we can safeguard.
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

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const isInWishlist = (productId) => {
      return wishlist.some(item => item.productId === productId);
  }

  return (
    
      {children}
    
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
