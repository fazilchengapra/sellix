import React, { useState } from "react";
import { formatPrice } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import api from "../../api/axios";
import {
  CreditCard,
  Banknote,
  Lock,
  ChevronRight,
} from "lucide-react";

// ── Razorpay script loader (unchanged from previous) ──────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ── Component ──────────────────────────────────────────────────────────
export const CheckoutPayment = ({ finalTotal }) => {
  const { clearCart, total, cart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Razorpay flow (same logic as the existing "Pay Securely" button) ─
  const handleRazorpay = async () => {
    setIsProcessing(true);

    try {
      // 1. Create order
      const orderResponse = await api.post("/orders/", {
        payment_method: "Razorpay",
      });
      const order = orderResponse.data;

      // 2. Initiate Razorpay payment
      const initiateResponse = await api.post("/payments/initiate/", {
        order_id: order.id,
      });
      const { razorpay_order_id, amount, currency, key } =
        initiateResponse.data;

      // 3. Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        showToast(
          "Razorpay SDK failed to load. Please check your connection.",
          "error"
        );
        setIsProcessing(false);
        return;
      }

      // 4. Open Razorpay checkout
      const options = {
        key,
        amount,
        currency,
        name: "Sellix",
        description: "Order Payment",
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await api
              .post("/payments/verify/", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              })
              .catch(() => {});
          } finally {
            await clearCart();
            showToast("Payment successful! Order placed.", "success");
            navigate("/orders");
          }
        },
        prefill: {
          name: user?.username || user?.first_name || "Customer",
          email: user?.email || "",
        },
        theme: { color: "#2563EB" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        showToast(
          response.error.description || "Payment failed",
          "error"
        );
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error", error);
      showToast(
        "Failed to initiate payment. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ── COD placeholder ─────────────────────────────────────────────────
  const handleCOD = () => {
    // COD functionality will be implemented later
  };

  // ── Place Order handler ─────────────────────────────────────────────
  const handlePlaceOrder = () => {
    if (!user) {
      showToast("You must be logged in to place an order.", "error");
      return;
    }

    if (paymentMethod === "razorpay") {
      handleRazorpay();
    } else {
      handleCOD();
    }
  };

  // ── Payment method option data ──────────────────────────────────────
  const methods = [
    {
      id: "razorpay",
      label: "Pay Online",
      sublabel: "UPI · Cards · Netbanking · Wallets",
      icon: CreditCard,
      badge: "Recommended",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      sublabel: "Pay when your order arrives",
      icon: Banknote,
      badge: null,
    },
  ];

  return (
    <Card className="p-6">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
          <CreditCard className="w-4.5 h-4.5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Method
        </h2>
      </div>

      {/* Radio Options */}
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              className={`
                relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }
              `}
            >
              {/* Custom radio circle */}
              <span
                className={`
                  relative shrink-0 w-5 h-5 rounded-full border-2
                  transition-all duration-200 flex items-center justify-center
                  ${
                    isSelected
                      ? "border-blue-600"
                      : "border-gray-300"
                  }
                `}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-scale-in" />
                )}
              </span>

              {/* Hidden native radio */}
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={isSelected}
                onChange={() => setPaymentMethod(method.id)}
                className="sr-only"
              />

              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                  transition-colors duration-200
                  ${
                    isSelected
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      isSelected ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {method.label}
                  </span>
                  {method.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {method.sublabel}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isSelected ? "text-blue-400" : "text-gray-300"
                }`}
              />
            </label>
          );
        })}
      </div>

      {/* Razorpay info box */}
      {paymentMethod === "razorpay" && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 animate-fade-in">
          <p className="text-sm text-blue-700">
            You'll be redirected to Razorpay's secure checkout to complete
            your payment. All major UPI apps, credit/debit cards and
            netbanking options are supported.
          </p>
        </div>
      )}

      {/* COD info box */}
      {paymentMethod === "cod" && (
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4 animate-fade-in">
          <p className="text-sm text-amber-700">
            Pay with cash when your order is delivered to your doorstep.
            Please keep the exact amount ready.
          </p>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-6">
        <Button
          onClick={handlePlaceOrder}
          className="w-full py-4 text-base gap-2"
          isLoading={isProcessing}
          disabled={isProcessing}
        >
          <Lock className="w-4 h-4" />
          {paymentMethod === "razorpay"
            ? `Pay Securely ${formatPrice(finalTotal)}`
            : `Place Order ${formatPrice(finalTotal)}`}
        </Button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-gray-400 mt-4">
        By placing your order, you agree to our Terms of Service and
        Privacy Policy.
      </p>
    </Card>
  );
};

export default CheckoutPayment;
