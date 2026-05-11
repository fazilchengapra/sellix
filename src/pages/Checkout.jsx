import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { formatPrice } from "../lib/utils";
import { ShoppingBag, Shield, Truck } from "lucide-react";
import { CheckoutPayment } from "../components/payment/CheckoutPayment";

const Checkout = () => {
  const { cart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = total > 5000 ? 0 : 50;
  const finalTotal = total + shipping;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, user, navigate]);

  if (!user || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Review your order and choose a payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Order Items & Payment */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShoppingBag className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items ({cart.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
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
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <CheckoutPayment finalTotal={finalTotal} />
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Including all taxes</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Secure & encrypted payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>
                    {shipping === 0
                      ? "Free delivery on this order"
                      : "Free delivery on orders above ₹5,000"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
