import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';


export const OrderSummary = ({ total, onCheckout }) => {
  return (
    
      Order Summary
      
      
        
          Subtotal
          ₹{total}
        
        
          Shipping
          Free
        
        
        
          Total
          ₹{total}
        
      

      
        Proceed to Checkout
        <ArrowRight className="w-5 h-5 group-hover);
};
