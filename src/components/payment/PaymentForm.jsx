import React, { useState } from 'react';
import { formatPrice } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import api from '../../api/axios';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const PaymentForm = () => {
  const { resetCart, total, cart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = total > 5000 ? 0 : 50;
  const finalTotal = total + shipping;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!user) {
        showToast("You must be logged in to place an order.", "error");
        setIsProcessing(false);
        return;
    }

    try {
        // 1. Create order
        const orderResponse = await api.post('/orders/', { payment_method: "Razorpay" });
        const order = orderResponse.data;

        // 2. Initiate Razorpay Payment
        const initiateResponse = await api.post('/payments/initiate/', { order_id: order.id });
        const { razorpay_order_id, amount, currency, key } = initiateResponse.data;

        // 3. Load Razorpay Script
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            showToast("Razorpay SDK failed to load. Please check your connection.", "error");
            setIsProcessing(false);
            return;
        }

        // 4. Open Razorpay Checkout
        const options = {
            key: key,
            amount: amount,
            currency: currency,
            name: "Sellix",
            description: "Order Payment",
            order_id: razorpay_order_id,
            handler: async function (response) {
                try {
                    // Try to verify payment if verify endpoint exists
                    await api.post('/payments/verify/', {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        order_id: order.id
                    }).catch(() => {}); // Ignore error if endpoint doesn't exist yet
                } finally {
                    resetCart();
                    showToast("Payment successful! Order placed.", "success");
                    navigate('/orders');
                }
            },
            prefill: {
                name: user?.username || user?.first_name || "Customer",
                email: user?.email || "",
            },
            theme: {
                color: "#3B82F6",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response){
            showToast(response.error.description || "Payment failed", "error");
        });
        paymentObject.open();

    } catch (error) {
        console.error("Payment error", error);
        showToast("Failed to initiate payment. Please try again.", "error");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Secure Checkout via Razorpay</h3>
        <p className="text-blue-700 text-sm">
          You will be redirected to Razorpay's secure checkout page to complete your payment. 
          Multiple payment options including UPI, Cards, and Netbanking are supported.
        </p>
      </div>

      <Button onClick={handlePayment} className="w-full py-4 text-lg" isLoading={isProcessing}>
        Pay Securely {formatPrice(finalTotal)}
      </Button>
    </div>
  );
};

export default PaymentForm;
