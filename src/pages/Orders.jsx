import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { Package, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';

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
      const response = await api.get(`/orders/`);
      const ordersData = response.data?.results || response.data || [];
      const sortedOrders = Array.isArray(ordersData) ? ordersData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setOrders(sortedOrders);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="block group">
            <Card className="p-6 border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    
                    {/* Left: Info */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Package size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">Order #{String(order.id).substring(0, 8).toUpperCase()}</span>
                                <Badge variant={order.status === 'Delivered' ? 'success' : 'default'} className="text-[10px] px-2 py-0.5">
                                    {order.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatPrice(order.total)} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Right: Action */}
                    <div className="flex items-center text-blue-600 font-medium text-sm sm:self-center self-start">
                        View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Preview Items (First 3) */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden relative" title={item.product_name}>
                            <img src={item.image} alt={item.product_name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                    {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                            +{order.items.length - 3} more
                        </div>
                    )}
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
