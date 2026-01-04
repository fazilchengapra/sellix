import { CreditCard } from 'lucide-react';


export const PaymentForm = ({
  formData,
  errors,
  total,
  isProcessing,
  onFieldUpdate,
  onSubmit,
  formatCardNumber,
  formatExpiry
}) => {
  return (
     onFieldUpdate('cardNumber', formatCardNumber(e.target.value))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && (
            {errors.cardNumber}
          )}
        

        {/* Cardholder Name */}
        
          
            Cardholder Name
          
           onFieldUpdate('cardName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
              errors.cardName ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="JOHN DOE"
          />
          {errors.cardName && (
            {errors.cardName}
          )}
        

        {/* Expiry & CVV */}
        
          
            
              Expiry Date
            
             onFieldUpdate('expiry', formatExpiry(e.target.value))}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.expiry ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.expiry && (
              {errors.expiry}
            )}
          

          
            
              CVV
            
             onFieldUpdate('cvv', e.target.value.replace(/\D/g, ''))}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.cvv ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="123"
              maxLength={4}
            />
            {errors.cvv && (
              {errors.cvv}
            )}
          
        

        {/* Submit Button */}
        
          {isProcessing ? 'Processing...' : `Pay ₹${total}`}
        
      

      
        🔒 Your payment information is secure and encrypted
      
    
  );
};
