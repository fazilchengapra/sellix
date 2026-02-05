import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AlertDialog from '../../components/ui/AlertDialog';
import Pagination from '../../components/ui/Pagination';
import OrdersHeader from '../../components/admin/orders/OrdersHeader';
import OrdersToolbar, { OrdersSearch } from '../../components/admin/orders/OrdersToolbar';
import OrdersTable from '../../components/admin/orders/OrdersTable';

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
        
        const response = await api.patch(`/orders/${orderId}`, {status: newStatus });
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

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <OrdersHeader />
        <OrdersToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusOptions={statusOptions}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <OrdersSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <OrdersTable 
            orders={currentOrders} 
            onNavigate={(id) => navigate(`/admin/orders/${id}`)}
            onDelete={confirmDeleteOrder}
        />
        
        <div className="p-4 border-t border-gray-100">
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
