import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PaymentForm } from "../components/payment/PaymentForm";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const Payment = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, user, navigate]);

  if (!user || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        <div className="grid gap-8">
          <Card className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
              <p className="text-gray-500">
                Complete your purchase safely and securely.
              </p>
            </div>
            <PaymentForm />
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Your data is processed securely. By clicking "Pay", you agree to
              our Terms...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
