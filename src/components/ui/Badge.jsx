

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    brand: 'bg-blue-50 text-blue-600',
    discount: 'bg-red-500 text-white',
    success: 'bg-green-50 text-green-600'
  };
  
  return (
    
      {children}
    
  );
};
