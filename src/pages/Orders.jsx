import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import api from '../api/axios';



const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/orders');
        // Filter orders for current user
        const userOrders = response.data.filter((order) => order.userId === user.id);
        // Sort by date, newest first
        userOrders.sort((a) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year);
  };

  if (loading) {
    return ;
  }

  if (orders.length === 0) {
    return (
       navigate('/')}>
            Start Shopping
          
        }
      />
    );
  }

  return (
     (
            
                  
                  
                    
                    {formatDate(order.createdAt)}
                  
                
                
                  {order.status}
                  
                    
                    {order.paymentMethod}
                  
                
              

              {/* Order Items */}
              
                {order.items.map((item, index) => (
                  

              {/* Order Total */}
              
                Order Total
                ₹{order.total}
              
            
          ))}
        
      
    
  );
};

export default Orders;
