

export const Card = ({ children, className = '', padding = 'md' }) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    
      {children}
    
  );
};
