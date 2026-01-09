import React, { useState } from 'react';
import { formatPrice } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { paymentSchema } from '../../lib/validations';
import api from '../../api/axios';

export const PaymentForm = () => {
  const { clearCart, total, cart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = total > 5000 ? 0 : 50;
  const finalTotal = total + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsProcessing(true);

    const result = paymentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      setIsProcessing(false);
      return;
    }
    
    if (!user) {
        showToast("You must be logged in to place an order.", "error");
        setIsProcessing(false);
        return;
    }

    const orderData = {
        userId: user.id,
        items: cart,
        total: finalTotal,
        shipping: shipping,
        subtotal: total,
        status: 'Processing',
        createdAt: new Date().toISOString(),
        paymentMethod: 'Card', 
        cardName: formData.cardName // saving card name for reference, avoiding sensitive data
    };

    try {
        await api.post('/orders', orderData);
        await clearCart();
        showToast("Payment successful! Order placed.", "success");
        navigate('/orders');
    } catch (error) {
        console.error("Order placement error", error);
        showToast("Failed to place order. Please try again.", "error");
        setIsProcessing(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Cardholder Name"
        placeholder="John Doe"
        value={formData.cardName}
        onChange={(e) => updateField('cardName', e.target.value)}
        error={errors.cardName}
      />
      
      <Input
        label="Card Number"
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        value={formData.cardNumber}
        onChange={(e) => updateField('cardNumber', e.target.value)}
        error={errors.cardNumber}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          placeholder="MM/YY"
          maxLength={5}
          value={formData.expiry}
          onChange={(e) => updateField('expiry', e.target.value)}
          error={errors.expiry}
        />
        
        <Input
          label="CVV"
          placeholder="123"
          maxLength={4}
          value={formData.cvv}
          onChange={(e) => updateField('cvv', e.target.value)}
          error={errors.cvv}
        />
      </div>

      <Button type="submit" className="w-full py-4 text-lg" isLoading={isProcessing}>
        Pay {formatPrice(finalTotal)}
      </Button>
    </form>
  );
};

export default PaymentForm;
