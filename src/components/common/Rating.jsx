import { Star } from 'lucide-react';


export const Rating = ({ rating, reviewCount, size = 'md', showCount = true }) => {
  const iconSize = size === 'sm' ? 14 : 18;
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  
  return (
    
      
        
        {rating}
      
      {showCount && reviewCount && (
        
      )}
    
  );
};
