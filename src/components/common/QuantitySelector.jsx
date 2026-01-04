
export const QuantitySelector = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  min = 1,
  max,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' 
    ? 'w-24 h-10 text-sm' 
    : 'w-32 h-12 text-base';
  
  const buttonClasses = size === 'sm' 
    ? 'w-8 h-10' 
    : 'w-10 h-12';
  
  return (
    
      <button 
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${buttonClasses} hover);
};
