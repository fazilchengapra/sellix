import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';



const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/cart?userId=${user.id}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
        setCart([]);
    }
  }, []);


  const addToCart = async (item) => {
    if (!user) {
        alert("Please login to add to cart");
        return;
    }
    
    const existingItem = cart.find(
        c => c.productId === item.productId && c.size === item.size && c.color === item.color
    );

    if (existingItem) {
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity };
        await api.put(`/cart/${existingItem.id}`, updatedItem);
        setCart(prev => prev.map(c => c.id === existingItem.id ? updatedItem ));
    } else {
        const newItem = { ...item, userId: user.id };
        const response = await api.post('/cart', newItem);
        setCart(prev => [...prev, response.data]);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setCart(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    // json-server doesn't allow bulk delete easily, so we loop. 
    // Not efficient but fits constraints.
    const deletePromises = cart.map(item => api.delete(`/cart/${item.id}`));
    await Promise.all(deletePromises);
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    
      {children}
    
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
