
export const PriceDisplay = ({ 
  price, 
  finalPrice, 
  discount, 
  size = 'md',
  layout = 'vertical'
}) => {
  const sizes = {
    sm: { final: 'text-lg', original: 'text-sm', discount: 'text-xs' },
    md: { final: 'text-xl', original: 'text-base', discount: 'text-sm' },
    lg: { final: 'text-3xl', original: 'text-xl', discount: 'text-base' }
  };
  
  const containerClass = layout === 'horizontal' 
    ? 'flex items-center gap-2' 
    : 'flex flex-col';
  
  return (
    
      
        ₹{finalPrice.toLocaleString()}
      
      {discount && discount > 0 && (
        <>
          
            ₹{price.toLocaleString()}
          
          
            {discount}% OFF
          
        
      )}
    
  );
};
