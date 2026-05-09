import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/cart/`);
      const formattedItems = (response.data.items || []).map(item => ({
          id: item.id,
          productId: item.product, 
          productName: item.product_name,
          price: parseFloat(item.price),
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity
      }));
      setCart(formattedItems);
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
  }, [user]);

  const addToCart = async (item) => {
    if (!user) return;
    
    try {
        await api.post('/cart/', {
            product_id: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity
        });
        await fetchCart();
    } catch (error) {
        console.error("Error adding to cart", error);
        throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    
    if (quantity < 1) return;
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const previousCart = [...cart];
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));

    try {
        console.log("PATCH sending", id, quantity);

        await api.patch(`/cart/${Number(id)}/`, { quantity });
    } catch (error) {
        console.error("Error updating quantity", error);
        setCart(previousCart);
        throw error;
    }
  };

  const removeFromCart = async (id) => {
    const previousCart = [...cart];
    setCart(prev => prev.filter(item => item.id !== id));

    try {
      await api.delete(`/cart/${id}/`);
    } catch (error) {
      console.error("Error removing from cart", error);
      setCart(previousCart);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const previousCart = [...cart];
    setCart([]);
    try {
        const deletePromises = previousCart.map(item => api.delete(`/cart/${item.id}/`));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error clearing cart", error);
        setCart(previousCart);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
