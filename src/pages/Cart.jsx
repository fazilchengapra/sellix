import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { EmptyCartState } from '../components/payment/EmptyCartState';

const Cart = () => {
  const { cart } = useCart();

  if (cart.length === 0) {
    return (
        <div className="min-h-[calc(100vh-4rem)] pt-8 pb-12">
            <EmptyCartState />
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;
