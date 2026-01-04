import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';

const Cart = () => {
  const { cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
       navigate('/')}>
            Start Shopping
          
        }
      />
    );
  }

  return (
     (
              
            ))}
          

          
             navigate('/payment')} 
            />
          
        
      
    
  );
};

export default Cart;
