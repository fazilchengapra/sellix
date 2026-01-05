import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { Package } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/orders?userId=${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size={40} />
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-8 pb-12">
        <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to create your first order."
            actionLabel="Browse Products"
            actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-medium text-gray-900">#{order.id.substring(0, 8)}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                 <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                 </div>
                 <Badge variant="success" className="px-3 py-1">
                   {order.status}
                 </Badge>
              </div>
            </div>

            <div className="space-y-4">
               {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                       <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.productName} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                       </div>
                       <p className="font-semibold">{formatPrice(item.price)}</p>
                   </div>
               ))}
            </div>

            <div className="mt-6 flex justify-end">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</p>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
