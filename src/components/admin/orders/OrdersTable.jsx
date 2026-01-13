import { Eye, Trash2, Filter } from "lucide-react";

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

const OrdersTable = ({ orders, onNavigate, onDelete }) => {
  return (
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
          {orders.map((order) => (
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
                        onClick={() => onNavigate(order.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                         onClick={() => onDelete(order.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
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
    </div>
  );
};
export default OrdersTable;
