import { Trash2 } from 'lucide-react';


export const CartItem = ({ 
  id, 
  image, 
  productName, 
  price, 
  quantity, 
  size, 
  color, 
  onRemove 
}) => {
  return (
     onRemove(id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all sm:hidden"
            aria-label="Remove item"
          >
            
          
        
      

      
        ₹{price * quantity}
         onRemove(id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          
        
      
    
  );
};
