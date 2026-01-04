import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { paymentSchema} from '../lib/validations';
import { OrderSummaryCard } from '../components/payment/OrderSummaryCard';
import { PaymentForm } from '../components/payment/PaymentForm';
import { EmptyCartState } from '../components/payment/EmptyCartState';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber);
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return  navigate('/')} />;
  }

  const updateField = (field) => {
    setFormData({ ...formData, [field]);
    if (errors[field]) {
      setErrors({ ...errors, [field]);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = paymentSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] PaymentFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: user?.id,
        items: cart,
        total,
        paymentMethod: 'card',
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      await api.post('/orders', orderData);
      await clearCart();
      
      showToast("Payment successful! Your order has been placed", "success", 4000);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Payment failed);
      showToast("Payment failed. Please try again", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => value.replace(/\D/g, '');
  
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm);
};

export default Payment;
