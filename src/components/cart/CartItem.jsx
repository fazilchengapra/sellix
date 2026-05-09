import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const handleUpdateQuantity = async (newQuantity) => {
      try {
          await updateQuantity(item.id, newQuantity);
      } catch (error) {
          showToast(error.response?.data?.error || "Failed to update quantity", "error");
      }
  };

  const handleRemove = async () => {
      try {
          await removeFromCart(item.id);
      } catch (error) {
          showToast(error.response?.data?.error || "Failed to remove item", "error");
      }
  };

  return (
    <Card className="flex flex-col sm:flex-row p-4 gap-4 transition-all hover:shadow-md">
      {/* Image */}
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img 
          src={item.image} 
          alt={item.productName} 
          className="w-full h-full object-cover mix-blend-multiply" 
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{item.productName}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
               {item.size && <span>Size: {item.size}</span>}
               {item.color && (
                 <div className="flex items-center gap-1">
                   <span>Color:</span>
                   <span 
                     className="w-3 h-3 rounded-full border border-gray-200" 
                     style={{ backgroundColor: item.color }} 
                   />
                 </div>
               )}
            </div>
          </div>
          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="icon" 
                className="w-8 h-8 rounded-full p-0"
                onClick={() => handleUpdateQuantity(Math.max(1, item.quantity - 1))}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button 
                variant="outline" 
                size="icon" 
                className="w-8 h-8 rounded-full p-0"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
                <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Remove */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
