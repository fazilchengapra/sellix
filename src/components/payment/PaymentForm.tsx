import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { paymentSchema } from '../../lib/validations';

export const PaymentForm = () => {
  const { clearCart, total } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsProcessing(true);

    const result = paymentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await clearCart();
    showToast("Payment successful! Order placed.", "success");
    navigate('/orders');
  };

  const updateField = (field: keyof typeof formData, value: string) => {
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
        Pay ${total.toFixed(2)}
      </Button>
    </form>
  );
};

export default PaymentForm;

