import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const OrderSummary = () => {
  const { total } = useCart();
  const navigate = useNavigate();

  const shipping = total > 100 ? 0 : 10;
  const finalTotal = total + shipping;

  return (
    <Card className="p-6 h-fit sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        className="w-full py-6 text-lg" 
        onClick={() => navigate('/payment')}
      >
        Proceed to Checkout
      </Button>
      
      <p className="mt-4 text-xs text-center text-gray-500">
        Free shipping on orders over $100
      </p>
    </Card>
  );
};

export default OrderSummary;
