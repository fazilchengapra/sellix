import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyCartState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
      </p>
      <Link to="/products">
        <Button size="lg">
          Start Shopping
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCartState;
