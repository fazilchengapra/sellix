
import { ShoppingCart, Heart } from 'lucide-react';

// Since we are refactoring ProductDetails, let's keep it self-contained for now, or assume the type is passed/imported.
// For now, I'll inline the interfaces or re-use them if possible. Ideally these should be in a types file.


export const ProductImages = ({ currentImages, productName, activeImage, setActiveImage }) => (
  
    
       (
         setActiveImage(idx)}
          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
            activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'
          }`}
        >
          
        
      ))}
    
  
);

export const ProductHeader = ({ brand, name }) => (
  <>
    
      
        {brand}
      
    
    {name}
  
);

export const ProductPrice = ({ price, finalPrice, discount }) => (
  
    ₹{finalPrice}
    {discount > 0 && (
      <>
        ₹{price}
        {discount}% OFF
      
    )}
  
);


export const ColorSelector = ({ colors, selectedColor, onSelectColor }) => (
  
    Select Color
    
      {colors.map((color, idx) => (
         onSelectColor(idx)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            selectedColor === idx ? 'border-blue-600 scale-110' : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ backgroundColor: color.hex }}
          title={color.colorName}
        >
          {/* Checkmark logic could be extracted but this is small enough */}
        
      ))}
    
  
);

[];
    selectedSize: number | null;
    onSelectSize: (size) => void;
}

export const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => (
    
        
            Select Size
             (
                 onSelectSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                    className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === sizeObj.size
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : sizeObj.stock === 0
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                : 'border-gray-200 text-gray-700 hover:border-blue-400'
                    }`}
                >
                    {sizeObj.size}
                
            ))}
        
    
);


export const ActionButtons = ({ quantity, setQuantity, handleAddToCart, handleWishlist, isWishlisted }) => (
     setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 sm:w-10 h-10 sm:h-12 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors"
                >
                    -
                
                {quantity}
                 setQuantity(quantity + 1)}
                    className="w-8 sm:w-10 h-10 sm:h-12 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors"
                >
                    +
                
            

            
                
                Add to Cart
            

            
                
            
        
    
);
