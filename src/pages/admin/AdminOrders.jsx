import { useState, useEffect } from 'react';
import { Search, Eye, Filter, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AlertDialog from '../../components/ui/AlertDialog';

import Pagination from '../../components/ui/Pagination';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState({
      isOpen: false,
      title: '',
      message: '',
      variant: 'danger',
      onConfirm: () => {},
      loading: false
  });
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
      let result = orders;
      
      if (searchQuery) {
          result = result.filter(o => 
              o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.userId.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }

      if (statusFilter !== 'All') {
          result = result.filter(o => o.status === statusFilter);
      }
      
      // Sort by newest
      result = result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredOrders(result);
      setCurrentPage(1); // Reset to first page on filter change
  }, [orders, searchQuery, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteOrder = (orderId) => {
      setAlertConfig({
          isOpen: true,
          title: 'Delete Order',
          message: `Are you sure you want to delete order #${orderId}? This action cannot be undone.`,
          variant: 'danger',
          confirmText: 'Delete',
          onConfirm: () => handleDeleteOrder(orderId)
      });
  };

  const handleDeleteOrder = async (orderId) => {
      setAlertConfig(prev => ({ ...prev, loading: true }));
      try {
          await api.delete(`/orders/${orderId}`);
          setOrders(prev => prev.filter(o => o.id !== orderId));
          showToast("Order deleted successfully", "success");
          setAlertConfig(prev => ({ ...prev, isOpen: false }));
          if(selectedOrder?.id === orderId) setSelectedOrder(null);
      } catch (error) {
          console.error(error);
          showToast("Failed to delete order", "error");
          setAlertConfig(prev => ({ ...prev, isOpen: false }));
      }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
        const response = await api.patch(`/orders/${orderId}`, { status: newStatus });
        const updatedOrder = response.data;
        setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(updatedOrder);
        }
        showToast("Order status updated", "success");
    } catch (error) {
        console.error("Failed to update status", error);
        showToast("Failed to update status", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
             <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                 <Filter size={16} className="text-gray-400" />
                 <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer"
                >
                     {statusOptions.map(opt => (
                         <option key={opt} value={opt}>{opt === 'All' ? 'All Status' : opt}</option>
                     ))}
                 </select>
             </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search by Order ID or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      #{order.id.split('-')[0]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <span className="block text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                              {order.userId.substring(0, 2)}
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-900">User {order.userId.substring(0, 4)}</p>
                              <p className="text-xs text-gray-400">{order.items.length} items</p>
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                         {order.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                        <button 
                             onClick={() => confirmDeleteOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500 bg-white">
                        <div className="flex flex-col items-center justify-center">
                            <Filter size={48} className="text-gray-200 mb-4" />
                            <p className="text-lg font-medium text-gray-900">No orders found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <OrderDetailsModal 
          isOpen={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onDelete={confirmDeleteOrder}
      />
      
      <AlertDialog
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          variant={alertConfig.variant}
          confirmText={alertConfig.confirmText}
          loading={alertConfig.loading}
          onConfirm={alertConfig.onConfirm}
          onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
      />
    </div>
  );
};

export default AdminOrders;
