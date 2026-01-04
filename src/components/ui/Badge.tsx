import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  children?: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    outline: "text-gray-900 border border-gray-200",
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <span
      ref={ref}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
