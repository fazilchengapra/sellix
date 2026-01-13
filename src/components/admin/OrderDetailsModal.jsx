import { X, Package, MapPin, CreditCard, User, Trash2 } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { Badge } from '../ui/Badge';

const OrderDetailsModal = ({ order, isOpen, onClose, onStatusChange, onDelete }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
                <Badge variant={order.status === 'Delivered' ? 'success' : 'default'}>{order.status}</Badge>
            </div>
            <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
            {/* Status & Actions */}
             <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl gap-4">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                     <span className="text-sm font-medium text-gray-700">Update Status:</span>
                     <select 
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        disabled={order.status === 'Cancelled'}
                        className="bg-white border text-sm border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                     >
                         {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                             <option key={s} value={s}>{s}</option>
                         ))}
                     </select>
                 </div>
                 <button 
                    onClick={() => {
                        onDelete(order.id);
                        onClose();
                    }}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
                 >
                     <Trash2 size={16} /> Delete Order
                 </button>
             </div>

            {/* Order Items */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={20} /> Items</h3>
                <div className="space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.productName}</p>
                                        <p className="text-sm text-gray-500 mt-1">Size: {item.size} • Color: {item.color}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 ml-4">{formatPrice(item.price)}</p>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="border border-gray-100 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={16} /> Customer Details
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span className="text-gray-400">User ID</span>
                            <span className="font-mono">{order.userId}</span>
                        </div>
                        {/* Assuming we might fetch user details separately later, showing generic for now */}
                        <div className="flex justify-between">
                            <span className="text-gray-400">Name</span>
                            <span className="font-medium text-gray-900">Customer {order.userId}</span> 
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-400">Email</span>
                            <span className="font-medium text-gray-900">customer@example.com</span> 
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="border border-gray-100 rounded-xl p-5">
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CreditCard size={16} /> Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Payment Method</span>
                            <span className="font-medium text-gray-900">{order.paymentMethod || 'Credit Card'}</span>
                        </div>
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal || order.total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-gray-900 text-base">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
